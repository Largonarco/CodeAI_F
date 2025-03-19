"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const auth = getAuth();

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			await sendPasswordResetEmail(auth, email);
			setSuccess("Password reset email sent. Please check your inbox.");
			setEmail("");
		} catch (err: any) {
			setError(err.message || "Failed to send reset email. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container flex h-screen w-screen flex-col items-center justify-center mx-auto">
			<div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
				<div className="space-y-1 text-center">
					<h1 className="text-2xl font-bold">Reset Password</h1>
					<p className="text-sm text-gray-500">Enter your email to receive a password reset link</p>
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
					<form onSubmit={handleResetPassword} className="space-y-4">
						<div className="space-y-2">
							<label htmlFor="email" className="text-sm font-medium">
								Email
							</label>
							<input
								id="email"
								type="email"
								placeholder="m@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								required
							/>
						</div>
						<button
							type="submit"
							className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
							disabled={loading}>
							{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> : null}
							Send Reset Link
						</button>
					</form>
					<p className="mt-4 text-center text-sm text-gray-500">
						Remember your password?{" "}
						<Link href="/signin" className="text-blue-600 underline underline-offset-4 hover:text-blue-800">
							Back to Sign In
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
