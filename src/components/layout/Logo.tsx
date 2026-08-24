"use client";

import { useId } from "react";
import Link from "next/link";

export function LogoMark({ className = "" }: { className?: string }) {
  const gradientId = `andrezinho-mark-${useId()}`;

  return (
    <svg viewBox="0 46 200 160" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#14C38E" />
          <stop offset="1" stopColor="#FF6A3D" />
        </linearGradient>
      </defs>
      <path
        d="M 30 160 A 70 70 0 0 1 170 160"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="26"
        strokeLinecap="round"
      />
      <circle cx="100" cy="90" r="24" fill="#ffffff" />
      <path
        d="M 90 90 L 98 99 L 112 78"
        stroke="#0E8F63"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 100 128 L 88 168 M 100 128 L 112 168 M 93 152 L 107 152"
        stroke="#0E8F63"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-ink ${className}`}
    >
      <LogoMark className="h-7 w-7" />
      andrezinho
    </Link>
  );
}
