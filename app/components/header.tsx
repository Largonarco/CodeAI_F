"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FirebaseService } from "@/lib/firebase-client";
import { Loader2, User } from "lucide-react";
import type { UserProfile } from "../types/user";

interface HeaderProps {
	user: UserProfile | null;
}

export default function Header({ user }: HeaderProps) {
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	const handleLogout = async () => {
		setLoading(true);
		try {
			await FirebaseService.logout();
			router.push("/signin");
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setLoading(false);
		}
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<header className="px-4 lg:px-6 h-14 flex items-center border-b">
			<Link className="flex items-center justify-center" href="/">
				<span className="font-bold text-lg">CodeAI</span>
			</Link>
			<nav className="ml-auto flex gap-4 sm:gap-6">
				{user ? (
					<div className="relative" ref={dropdownRef}>
						<button
							className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
							onClick={() => setIsOpen(!isOpen)}>
							<User className="h-5 w-5" />
						</button>
						{isOpen && (
							<div className="absolute right-0 mt-2 w-48 rounded-md border bg-white py-1 shadow-lg">
								<div className="border-b px-4 py-2 text-sm font-medium">My Account</div>
								<Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
									Dashboard
								</Link>
								<Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
									Profile
								</Link>
								<div className="border-t">
									<button
										onClick={handleLogout}
										disabled={loading}
										className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50">
										{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
										Logout
									</button>
								</div>
							</div>
						)}
					</div>
				) : (
					<>
						<Link href="/signin" className="text-sm font-medium hover:underline underline-offset-4">
							Sign In
						</Link>
						<Link href="/signup" className="text-sm font-medium hover:underline underline-offset-4">
							Sign Up
						</Link>
					</>
				)}
			</nav>
		</header>
	);
}
