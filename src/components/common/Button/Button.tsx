"use client";

import Link from "next/link";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  link?: string;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
  type?: "fill" | "outline";
}

const Button: React.FC<ButtonProps> = ({
  children,
  link,
  onClick,
  className = "",
  variant = "primary",
  type = "fill",
}) => {
  const baseClasses =
    "rounded-full font-semibold transition-all duration-200 flex items-center py-1.5 px-4 border gap-2 cursor-pointer";

  const variantClasses =
    variant === "primary"
      ? type === "fill"
        ? `bg-primary text-white border-primary hover:bg-transparent hover:text-primary`
        : `text-primary border-primary hover:bg-primary hover:text-white`
      : type === "fill"
      ? `bg-secondary text-white border-secondary hover:bg-transparent hover:text-secondary`
      : `text-secondary border-secondary hover:bg-secondary hover:text-white`;

  const classes = `${baseClasses} ${variantClasses} ${className}`.trim();

  if (link) {
    return (
      <Link href={link} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
