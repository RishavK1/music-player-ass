const variants = new Set(['primary', 'secondary', 'ghost', 'destructive']);

export default function Button({
  children,
  variant = 'primary',
  iconOnly = false,
  className = '',
  type = 'button',
  ...props
}) {
  const appearance = variants.has(variant) ? variant : 'primary';

  return (
    <button
      {...props}
      type={type}
      className={`button button--${appearance} ${iconOnly ? 'button--icon' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
