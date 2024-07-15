"use client";

import { usePathname, useRouter } from "next/navigation";

import { useState } from "react";
import { useMedia } from "react-use";

import { NavButton } from "./nav-button";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const routes = [
    {
        href: "/",
        label: "Overview",
    },
    {
        href: "/transactions",
        label: "Transactions",
    },
    {
        href: "accounts",
        label: "Accounts",
    },
    {
        href: "categories",
        label: "Categories",
    },
];

export const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useMedia("(max-width: 1024px)", false);

    const router = useRouter();
    const pathname = usePathname();

    const onClick = (href: string) => {
        router.push(href);
        setIsOpen(false);
    };

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition-colors"
                    >
                        <Menu className="size-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="px-2">
                    <nav className="flex flex-col gap-y-2 pt-6">
                        {routes.map((route) => (
                            <Button
                                key={route.href}
                                variant={
                                    pathname === route.href
                                        ? "secondary"
                                        : "ghost"
                                }
                                onClick={() => onClick(route.href)}
                                className="w-full justify-start"
                            >
                                {route.label}
                            </Button>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <div className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
            {routes.map((route) => (
                <NavButton
                    key={route.href}
                    href={route.href}
                    label={route.label}
                    isActive={pathname === route.href}
                />
            ))}
        </div>
    );
};
