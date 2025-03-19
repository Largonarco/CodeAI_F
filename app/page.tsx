import Link from "next/link";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen">
			<header className="px-4 lg:px-6 h-14 flex items-center border-b">
				<Link className="flex items-center justify-center" href="/">
					<span className="font-bold text-lg">Multi-Agent Workflow</span>
				</Link>
				<nav className="ml-auto flex gap-4 sm:gap-6">
					<Link href="/signin" className="text-sm font-medium hover:underline underline-offset-4">
						Sign In
					</Link>
					<Link href="/signup" className="text-sm font-medium hover:underline underline-offset-4">
						Sign Up
					</Link>
				</nav>
			</header>
			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex justify-center items-center">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center space-y-4 text-center">
							<div className="space-y-2">
								<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">CodeAI</h1>
								<p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
									Leverage the power of multiple AI agents to streamline your workflow and boost productivity.
								</p>
							</div>
							<div className="space-x-4">
								<Link href="/signup">
									<button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
										Get Started
									</button>
								</Link>
								<Link href="/signin">
									<button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
										Sign In
									</button>
								</Link>
							</div>
						</div>
					</div>
				</section>
			</main>
			<footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
				<p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Multi-Agent Workflow. All rights reserved.</p>
			</footer>
		</div>
	);
}
