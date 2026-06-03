import Image from "next/image";

interface LogoProps {
  size?: number;
  showText?: boolean;
}

export function Logo({ size = 40, showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center justify-center">
        <Image
          src="/logo-himasis.png"
          alt="Himasis Logo"
          width={size}
          height={size}
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-tight leading-none text-slate-900">
            SMARTSIS
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-medium">
            Himasis
          </span>
        </div>
      )}
    </div>
  );
}
