import EmptyState from './EmptyState.jsx';

export default function PlaylistPanel({ active }) {
  return (
    <section
      id="playlist"
      aria-labelledby="playlist-heading"
      data-active={active}
      className="playlist-panel min-w-0"
    >
      <h2
        id="playlist-heading"
        className="mb-6 text-xl font-semibold tracking-display"
      >
        Your playlist
      </h2>

      <EmptyState
        title="No playlist selected"
        artwork={
          <div className="sleeve sleeve--compact" aria-hidden="true">
            <div className="sleeve-record">
              <div className="sleeve-label">
                <span className="sleeve-spindle" />
              </div>
            </div>
          </div>
        }
      >
        Select a playlist to see its songs.
      </EmptyState>
    </section>
  );
}
