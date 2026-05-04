import { ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface EditorialButtonProps {
  variant?: Variant;
  to?: string;
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

const base =
  "inline-flex items-center justify-center min-h-[48px] px-8 text-[13px] uppercase tracking-nav font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary:
    "bg-transparent border border-primary text-primary hover:bg-primary/10",
  ghost:
    "bg-transparent text-foreground hover:text-primary",
  danger:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
};

export const EditorialButton = ({
  variant = "primary",
  to,
  href,
  onClick,
  children,
  className = "",
  type = "button",
  disabled,
}: EditorialButtonProps) => {
  const cls = `${base} ${variants[variant]} ${className}`;

  if (to) return <Link to={to} className={cls}>{children}</Link>;
  if (href)
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {children}
      </a>
    );

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
};
