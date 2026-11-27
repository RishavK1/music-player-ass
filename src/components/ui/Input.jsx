import { useId } from 'react';

export default function Input({
  id,
  label,
  icon,
  hint,
  error,
  className = '',
  'aria-describedby': describedBy,
  ...props
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const message = error || hint;
  const messageId = `${inputId}-message`;
  const description = [describedBy, message ? messageId : null]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={`field ${className}`}>
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      <div className="field-control" data-invalid={Boolean(error)}>
        {icon}
        <input
          {...props}
          id={inputId}
          className="field-input"
          aria-invalid={error ? true : undefined}
          aria-describedby={description}
        />
      </div>
      {message && (
        <p
          id={messageId}
          className={`text-sm ${error ? 'text-destructive' : 'text-muted-foreground'}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
