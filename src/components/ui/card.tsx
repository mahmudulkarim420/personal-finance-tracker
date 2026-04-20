import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ children, ...props }: CardProps) {
  return <div {...props}>{children}</div>;
}
