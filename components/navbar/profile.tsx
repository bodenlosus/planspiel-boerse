"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Users, UserX } from "lucide-react";
import { useEffect, useState } from "react";

import { UserResponse } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { logout } from "@/app/auth/actions_client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface UserProfileProps {
  className?:string;
}

export function UserProfile({className}: UserProfileProps) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const getInitialString = (name: string): string => {
    const initials = Array.from(name.matchAll(/(?<!\w)\w/g)); // Convert the iterator to an array
    const firstInitial = initials[0] ? initials[0][0] : ""; // Extract the first match
    const lastInitial = initials.length > 1
      ? initials[initials.length - 1][0]
      : ""; // Extract the last match
    return `${firstInitial}${lastInitial}`;
  };

  const userName = user?.data.user?.user_metadata?.name;

  useEffect(() => {
    const getUser = async () => {
      const u = await supabase.auth.getUser();
      setUser(u);
    };
    getUser().catch(() => {});
  });
  return (
    <>
      <div className={cn(className)}>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="size-[2.2rem] text-muted-foreground transition-colors hover:text-foreground">
              <AvatarFallback>
                {userName
                  ? getInitialString(userName)
                  : <UserX className="size-4 stroke-muted-foreground" />}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{userName}</DropdownMenuLabel>

            <DropdownMenuItem className="gap-4">
              <Users className="size-3.5 stroke-muted-foreground" />
              Switch account
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => logout(router.push)}
              className="gap-4"
            >
              <LogOut className="size-3.5 stroke-muted-foreground" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
