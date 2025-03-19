"use client";

import type React from "react";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FirebaseService } from "@/lib/firebase-client";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		// Check if user was redirected after successful signup
		const signupSuccess = searchParams.get("signup");
		if (signupSuccess === "success") {
			setSuccess("Account created successfully! Please log in.");
		}
	}, [searchParams]);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			await FirebaseService.loginWithEmail(email, password);
			router.push("/dashboard");
		} catch (err: any) {
			setError(err.message || "Failed to log in. Please check your credentials.");
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		setLoading(true);
		setError(null);

		try {
			await FirebaseService.signInWithGoogle();
			router.push("/dashboard");
		} catch (err: any) {
			setError(err.message || "Failed to sign in with Google. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container flex h-screen w-screen flex-col items-center justify-center mx-auto">
			<div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
				<div className="space-y-1 text-center">
					<h1 className="text-2xl font-bold">Login</h1>
					<p className="text-sm text-gray-500">Enter your credentials to access your account</p>
				</div>
				<div className="mt-6">
					{error && (
						<div className="mb-4 rounded-md border border-red-500 bg-red-50 p-3 text-sm text-red-600">
							<div className="flex items-center">
								<AlertCircle className="mr-2 h-4 w-4" />
								<span>{error}</span>
							</div>
						</div>
					)}
					{success && (
						<div className="mb-4 rounded-md border border-green-500 bg-green-50 p-3 text-sm text-green-600">
							<div className="flex items-center">
								<CheckCircle2 className="mr-2 h-4 w-4" />
								<span>{success}</span>
							</div>
						</div>
					)}
					<form onSubmit={handleLogin} className="space-y-4">
						<div className="space-y-2">
							<label htmlFor="email" className="text-sm font-medium">
								Email
							</label>
							<input
								id="email"
								type="email"
								className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								placeholder="m@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="password" className="text-sm font-medium">
								Password
							</label>
							<input
								id="password"
								type="password"
								className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<div className="text-right text-sm">
								<Link href="/forgot-password" className="text-blue-600 hover:underline">
									Forgot password?
								</Link>
							</div>
						</div>
						<button
							type="submit"
							className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
							disabled={loading}>
							{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> : null}
							Login
						</button>
					</form>
					<div className="relative my-4">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-white px-2 text-gray-500">Or continue with</span>
						</div>
					</div>
					<button
						className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
						onClick={handleGoogleSignIn}
						disabled={loading}>
						{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> : null}
						Google
					</button>
					<p className="mt-4 text-center text-sm text-gray-500">
						Don't have an account?{" "}
						<Link href="/signup" className="text-blue-600 underline underline-offset-4 hover:text-blue-800">
							Sign Up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default function WrapperLoginPage() {
	return (
		<Suspense>
			<LoginPage />
		</Suspense>
	);
}
