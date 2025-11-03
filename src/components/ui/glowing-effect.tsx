import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface GlowingEffectProps {
  spread?: number;
  glow?: boolean;
  disabled?: boolean;
  proximity?: number;
  inactiveZone?: number;
  borderWidth?: number;
}

export const GlowingEffect = ({
  spread = 40,
  glow = true,
  disabled = false,
  proximity = 64,
  inactiveZone = 0.01,
  borderWidth = 3,
}: GlowingEffectProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled || !divRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!divRef.current) return;
      
      const rect = divRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      divRef.current.style.setProperty("--mouse-x", `${x}px`);
      divRef.current.style.setProperty("--mouse-y", `${y}px`);
      divRef.current.style.setProperty("--spread", `${spread}px`);
    };

    const parent = divRef.current.parentElement;
    parent?.addEventListener("mousemove", handleMouseMove);

    return () => {
      parent?.removeEventListener("mousemove", handleMouseMove);
    };
  }, [disabled, spread]);

  if (disabled) return null;

  return (
    <div
      ref={divRef}
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500",
        glow && "group-hover:opacity-100"
      )}
      style={{
        background: `radial-gradient(${proximity}px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(var(--primary) / ${inactiveZone}), transparent ${spread}%)`,
        border: `${borderWidth}px solid transparent`,
        maskImage: `radial-gradient(${proximity}px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black, transparent ${spread}%)`,
        WebkitMaskImage: `radial-gradient(${proximity}px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black, transparent ${spread}%)`,
      }}
    />
  );
};
