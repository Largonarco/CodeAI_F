"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FirebaseService } from "@/lib/firebase-client";
import { Loader2 } from "lucide-react";
import Header from "../components/header";

export default function ProfilePage() {
	const [user, setUser] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

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
				console.error("Authentication error:", error);
				router.push("/signin");
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, [router]);

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
			<main className="flex-1 container py-8 mx-auto">
				<div className="grid gap-6">
					<div className="rounded-lg border bg-card p-6 shadow-sm">
						<div className="space-y-1">
							<h2 className="text-xl font-semibold">Profile</h2>
							<p className="text-sm text-gray-500">View and manage your account information</p>
						</div>
						<div className="mt-6">
							<div className="space-y-4">
								<div className="space-y-2">
									<label htmlFor="email" className="text-sm font-medium">
										Email
									</label>
									<input
										id="email"
										value={user?.email || ""}
										disabled
										className="w-full rounded-md border border-gray-300 bg-gray-100 p-2 text-sm"
									/>
								</div>
								<div className="space-y-2">
									<label htmlFor="name" className="text-sm font-medium">
										Display Name
									</label>
									<input
										id="name"
										value={user?.display_name || ""}
										disabled
										className="w-full rounded-md border border-gray-300 bg-gray-100 p-2 text-sm"
									/>
								</div>
								<div className="space-y-2">
									<label htmlFor="uid" className="text-sm font-medium">
										User ID
									</label>
									<input
										id="uid"
										value={user?.uid || ""}
										disabled
										className="w-full rounded-md border border-gray-300 bg-gray-100 p-2 text-sm"
									/>
								</div>
								<div className="space-y-2">
									<label htmlFor="verified" className="text-sm font-medium">
										Email Verification Status
									</label>
									<div
										className={`text-sm p-2 rounded ${
											user?.email_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
										}`}>
										{user?.email_verified ? "Verified" : "Not Verified"}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
