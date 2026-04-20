import type { HTMLAttributes } from "react";

type DialogProps = HTMLAttributes<HTMLDivElement>;

export function Dialog({ children, ...props }: DialogProps) {
  return <div {...props}>{children}</div>;
}
