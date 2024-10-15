import { Social } from "@/components/auth/social";
import { BackButton } from "@/components/auth/back-button";
import { WrapperHeader } from "@/components/auth/wrapper-header";

interface FormWrapperProps {
  children?: React.ReactNode;
  headerTitle: string;
  headerSubtitle?: string;
  showSocial?: boolean;
  backButtonHref: string;
  backButtonLabel: string;
}

export function FormWrapper({
  children,
  headerTitle,
  headerSubtitle,
  showSocial,
  backButtonHref,
  backButtonLabel,
}: FormWrapperProps) {
  return (
    <div className="flex flex-col items-start xs:w-[400px] sm:w-[600px] xs:px-8  py-6 space-y-1.5 my-4">
      <WrapperHeader title={headerTitle} subtitle={headerSubtitle} />

      <BackButton href={backButtonHref} label={backButtonLabel} />

      <div className="w-full">{children}</div>

      <div className="space-y-5 w-full">{showSocial && <Social />}</div>
    </div>
  );
}
