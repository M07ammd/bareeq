import Link from "next/link";

type Variant = "chrome" | "glass" | "outline" | "holo";

type CommonProps = {
  variant?: Variant;
  size?: "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

type LinkProps = CommonProps & {
  href: string;
  /** opens in a new tab with the safe rel attributes */
  external?: boolean;
};

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

const cls = (variant: Variant, size: "md" | "lg", extra?: string) =>
  ["btn", `btn-${variant}`, size === "lg" ? "btn-lg" : "", extra ?? ""].filter(Boolean).join(" ");

export function Button(props: LinkProps | ButtonProps) {
  const { variant = "chrome", size = "md", className, children } = props;

  if ("href" in props && props.href !== undefined) {
    const { href, external } = props;
    return external ? (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls(variant, size, className)}
      >
        {children}
      </Link>
    ) : (
      <Link href={href} className={cls(variant, size, className)}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, href: _h, ...rest } =
    props as ButtonProps;
  void _v; void _s; void _c; void _ch; void _h;
  return (
    <button type="button" {...rest} className={cls(variant, size, className)}>
      {children}
    </button>
  );
}
