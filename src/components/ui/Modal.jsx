import { useEffect, useId, useRef } from 'react';

export default function Modal({
  title,
  description,
  children,
  initialFocusRef,
  fallbackFocusRef,
  onClose,
}) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;

    dialog.showModal();
    initialFocusRef?.current?.focus();

    return () => {
      dialog.close();
      const target = trigger?.isConnected ? trigger : fallbackFocusRef?.current;
      target?.focus();
    };
  }, [initialFocusRef, fallbackFocusRef]);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-3">
          <h2 id={titleId} className="text-xl font-semibold tracking-display">
            {title}
          </h2>
          {description && (
            <p id={descriptionId} className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </header>
        {children}
      </div>
    </dialog>
  );
}
