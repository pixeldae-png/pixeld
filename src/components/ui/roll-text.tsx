export function RollText({ children }: { children: string }) {
  return <span className="roll-text"><span>{children}</span><span aria-hidden="true">{children}</span></span>
}
