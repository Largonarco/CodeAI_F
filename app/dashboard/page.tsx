"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FirebaseService } from "@/lib/firebase-client";
import { Loader2 } from "lucide-react";
import type { MessageResponse } from "../types/agent";
import Header from "../components/header";

export default function DashboardPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [githubToken, setGithubToken] = useState("");
	const [user, setUser] = useState<any | null>(null);
	const [agentRequest, setAgentRequest] = useState("");
	const [agentLoading, setAgentLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [agentResponse, setAgentResponse] = useState<MessageResponse | null>(null);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const currentUser = await FirebaseService.getCurrentUser();
				if (!currentUser) {
					router.push("/signin");
					return;
				}

				setUser(currentUser);
			} catch (error) {
				router.push("/signin");
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, [router]);

	const handleRunAgent = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setAgentLoading(true);
		setAgentResponse(null);

		try {
			const response = await FirebaseService.runAgentWorkflow(agentRequest, githubToken || null);
			setAgentResponse(response);
		} catch (error: any) {
			setError(error.message || "Failed to run agent workflow. Please try again.");
		} finally {
			setAgentLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col">
			<Header user={user} />
			<main className="flex-1 container py-8 mx-auto px-4 max-w-full">
				<div className="grid gap-6 max-w-full">
					<div className="rounded-lg border bg-card p-6 shadow-sm">
						<div className="space-y-1">
							<h2 className="text-xl font-semibold">Welcome, {user?.displayName || user?.email}</h2>
							<p className="text-sm text-gray-500">Run your multi-agent workflow</p>
						</div>
						<div className="mt-6">
							<form onSubmit={handleRunAgent} className="space-y-4">
								<div className="space-y-2">
									<label htmlFor="request" className="text-sm font-medium">
										What would you like the agents to do?
									</label>
									<textarea
										id="request"
										placeholder="Describe your task..."
										value={agentRequest}
										onChange={(e) => setAgentRequest(e.target.value)}
										className="min-h-[100px] w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
										required
									/>
								</div>
								<div className="space-y-2">
									<label htmlFor="github-token" className="text-sm font-medium">
										GitHub Token (Optional)
									</label>
									<input
										id="github-token"
										type="password"
										placeholder="For GitHub operations"
										value={githubToken}
										onChange={(e) => setGithubToken(e.target.value)}
										className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
									/>
								</div>
								<button
									type="submit"
									className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
									disabled={agentLoading}>
									{agentLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> : null}
									Run Workflow
								</button>
							</form>
						</div>
					</div>

					{error && (
						<div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
							<p>{error}</p>
						</div>
					)}

					{agentResponse && (
						<div className="rounded-lg border bg-card p-6 shadow-sm overflow-hidden">
							<div className="space-y-1">
								<h2 className="text-xl font-semibold">Agent Response</h2>
							</div>
							<div className="mt-6 overflow-x-auto">
								<div className="space-y-4">
									{agentResponse.messages.map((message, index) => (
										<div key={index} className="rounded-lg bg-gray-100 p-4">
											<p className="font-medium">{message.role || "Agent"}</p>
											<p className="mt-2 whitespace-pre-wrap break-words">{message.content}</p>
										</div>
									))}
									{agentResponse.results && (
										<div className="mt-4">
											<h3 className="text-lg font-medium">Results</h3>
											<pre className="mt-2 rounded-lg bg-gray-100 p-4 overflow-x-auto max-w-full break-words">
												{JSON.stringify(agentResponse.results, null, 2)}
											</pre>
										</div>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
