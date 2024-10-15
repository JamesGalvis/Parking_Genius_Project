import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  href: string;
  label: string;
}

export function BackButton({ href, label }: BackButtonProps) {
  return (
    <Button
      size="sm"
      variant="link"
      className="text-muted-foreground text-zinc-200 font-normal p-0 m-0"
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
}
