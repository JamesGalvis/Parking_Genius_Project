"use client";

import { signIn } from "next-auth/react";
import { IconType } from "react-icons";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export function Social() {
  const onClick = (provider: "google") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="text-sm bg-white dark:bg-transparent px-2 ">
            or
          </span>
        </div>
      </div>
      
      <div className="flex  flex-cols-2 items-center justify-center gap-5 w-full mt-4">
        <div className="w-full">
        <SocialButton
          label="Google"
          Icon={FcGoogle}
          onClick={() => onClick("google")}
        />
        </div>

      </div>
    </>
  );
}

interface SocialButtonProps {
  label: string;
  onClick: () => void;
  Icon: IconType;
  iconClassName?: string;
}

function SocialButton({
  label,
  Icon,
  onClick,
  iconClassName,
}: SocialButtonProps) {
  return (
    <Button
      size="lg"
      className="relative bg-transparent group/btn w-full gap-2 hover:bg-muted/60 hover:border-gray-100 hover:border-border"
      variant="outline"
      onClick={onClick}
    >
      <Icon className={cn("h-5 w-5", iconClassName)} />
      <p className="text-sm text-primary/80 font-semibold">{label}</p>
    </Button>
  );
}
