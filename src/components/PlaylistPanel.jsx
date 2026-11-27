import EmptyState from './EmptyState.jsx';

export default function PlaylistPanel({ active }) {
  return (
    <section
      id="playlist"
      aria-labelledby="playlist-heading"
      data-active={active}
      className="playlist-panel min-w-0 xl:pl-8"
    >
      <h2
        id="playlist-heading"
        className="mb-8 text-xl font-semibold tracking-display"
      >
        Your playlist
      </h2>

      <EmptyState
        title="A mix that’s entirely yours"
        artwork={
          <div className="sleeve" aria-hidden="true">
            <div className="sleeve-record">
              <div className="sleeve-label">
                <span className="sleeve-spindle" />
              </div>
            </div>
          </div>
        }
      >
        Start with a name, add a few favourites, and put them in just the right
        order. Your selected playlist will appear here.
      </EmptyState>

      <p className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">
        No playlist selected.
      </p>
    </section>
  );
}
