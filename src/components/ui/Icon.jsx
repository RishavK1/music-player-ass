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
