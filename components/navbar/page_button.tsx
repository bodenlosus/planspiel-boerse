"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface NavBarPageButtonProps {
  /** The text to display inside the button */
  title: string;

  /** Whether the button can be interacted with */
  link: string;

  usePath?: boolean;

  compact?: boolean;

  className?: string;

  autoCompact?: boolean;

  children?: React.ReactNode;

  icon: {
    render: (props: { className: string }) => React.ReactNode;
    className?: string;
  };
}

export function NavBarPageButton({
  title,
  link,
  usePath,
  icon,
  compact,
  className,
  autoCompact,
}: NavBarPageButtonProps) {
  const pathname = usePathname();

  const active = usePath === true && pathname === link;
  const PageIcon = icon.render({
    className: cn(
      "size-7 shrink-0",
      active ? "stroke-background" : "stroke-muted-foreground",
      icon.className,
    ),
  });
  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={link}
              className={cn(
                `flex gap-2 size-fit py-2 px-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-red truncate overflow-hidden`,
                active ? "bg-primary" : "",
                className,
              )}
            >
              {PageIcon}
              <span
                className={cn(
                  active ? "inline text-sm text-background shadow" : "hidden",
                )}
              >
                {title}
              </span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{title}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={link}
            className={cn(
              `flex gap-4 w-[auto,fit] h-fit py-2 px-4 items-center rounded-md text-muted-foreground overflow-hidden transition-colors hover:text-foreground hover:bg-secondary`,
              active ? "bg-primary hover:bg-primary" : "",
              className,
            )}
          >
            {PageIcon}
            <span
              className={cn(
                "text-sm truncate",
                active ? "text-background" : "",
                autoCompact ? "hidden lg:inline" : "",
              )}
            >
              {title}
            </span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{title}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
