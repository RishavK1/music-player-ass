export default function EmptyState({
  title,
  children,
  artwork,
  action,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-start gap-6 ${className}`}>
      {artwork}
      <div className="flex max-w-copy flex-col gap-3">
        <h3 className="text-xl font-semibold tracking-display">{title}</h3>
        <p className="text-sm leading-body text-muted-foreground">{children}</p>
      </div>
      {action}
    </div>
  );
}
