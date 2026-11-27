const paths = {
  library: (
    <>
      <path d="M5 4v16M10 4v16M15 5l4 14" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="m5 12 4 4L19 6" />,
  up: <path d="m6 14 6-6 6 6" />,
  down: <path d="m6 10 6 6 6-6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  edit: (
    <>
      <path d="m15 4 5 5M4 20l5-1L20 8a2 2 0 0 0-5-5L4 14Z" />
    </>
  ),
  trash: (
    <>
      <path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7" />
    </>
  ),
  record: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <path d="M7 12a5 5 0 0 1 5-5M17 12a5 5 0 0 1-5 5" />
    </>
  ),
  playlist: (
    <>
      <path d="M4 6h16M4 12h10M4 18h8M19 12v8M15 16h8" />
    </>
  ),
  play: <path d="m9 5 11 7-11 7Z" fill="currentColor" stroke="none" />,
  pause: <path d="M7 5h3v14H7ZM14 5h3v14h-3Z" fill="currentColor" stroke="none" />,
  previous: (
    <>
      <path d="M6 5v14M18 5 8 12l10 7Z" />
    </>
  ),
  next: (
    <>
      <path d="M18 5v14M6 5l10 7-10 7Z" />
    </>
  ),
};

const sizes = {
  small: 'size-4',
  medium: 'size-5',
  large: 'size-6',
};

export default function Icon({ name, size = 'medium', className = '' }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${sizes[size]} ${className}`}
    >
      {paths[name]}
    </svg>
  );
}
