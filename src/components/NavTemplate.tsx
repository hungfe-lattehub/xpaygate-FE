import { ReactNode } from "react";

export interface ListLink {
	href: string;
	text: string;
	primary?: boolean;
}

export function NavTemplate({ children, listLinks, title }: {
	children: ReactNode,
	listLinks: ListLink[],
	title: string,
}) {
	return (
		<div className="flex min-h-screen w-full flex-col h-full">
			<main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-0 md:gap-2 md:p-6">
				<div className="mx-auto grid w-full gap-2">
					{/* Optional: Move the title out if you want to keep it in its original place as well */}
				</div>
				<div className="mx-auto grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[160px_1fr]">
					<nav className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0">
						{/* Title inside the navigation */}
						<h1 className="text-xl font-semibold mb-4">
							{title}
						</h1>
						{listLinks.map((link) => (
							<a key={link.text} href={link.href} className={`font-semibold ${link.primary ? 'text-primary' : ''}`}>
								{link.text}
							</a>
						))}
					</nav>
					<div className="grid">
						{children}
					</div>
				</div>
			</main>
		</div>
	);
}
