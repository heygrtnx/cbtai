"use client";

import { ReactNode } from "react";
import { cn } from "./utils";
import { HeroUIProvider } from "@heroui/react";

export function MaxWidthWrapper({ className, children }: { className?: string; children: ReactNode }) {
	return (
		<HeroUIProvider>
			<div className={cn("w-full", className)}>
				{children}
			</div>
		</HeroUIProvider>
	);
}
