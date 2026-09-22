import * as React from "react";
import Link from "next/link";
import { cn } from "@workspace/shared";
import { Button } from "./button";
import { Separator } from "./separator";

interface NavItem {
  href: string;
  label: string;
}

interface SiteHeaderProps extends React.HTMLAttributes<HTMLElement> {
  brand?: string;
  navItems?: NavItem[];
  ctaHref?: string;
  ctaLabel?: string;
}

export function SiteHeader({
  brand = "Turborepo Stack",
  navItems = [],
  ctaHref,
  ctaLabel = "Get started",
  className,
  ...props
}: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur",
        className
      )}
      {...props}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-brand text-brand-foreground">
              T
            </span>
            {brand}
          </Link>
          {navItems.length > 0 && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <nav className="flex items-center gap-4 text-sm text-muted-foreground">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {ctaHref ? (
            <Button asChild size="sm">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
