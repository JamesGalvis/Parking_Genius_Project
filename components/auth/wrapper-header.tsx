import Image from "next/image";

interface WrapperHeaderProps {
  title: string;
  subtitle?: string;
}

export function WrapperHeader({ title, subtitle }: WrapperHeaderProps) {
  return (
  
      <div className="">
        <h3 className="text-3xl font-extrabold leading-none">{title}</h3>
      </div>

  );
}
