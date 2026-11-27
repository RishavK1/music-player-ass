import EmptyState from './EmptyState.jsx';
import Icon from './ui/Icon.jsx';
import Input from './ui/Input.jsx';

export default function SongLibrary({ active }) {
  return (
    <section
      id="song-library"
      aria-labelledby="library-heading"
      data-active={active}
      className="library-panel min-w-0 xl:pr-8"
    >
      <header className="mb-6 flex flex-col gap-2">
        <h2 id="library-heading" className="text-xl font-semibold tracking-display">
          Song library
        </h2>
        <p className="text-sm text-muted-foreground">
          Find a track for your next playlist.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Input
          label="Search songs"
          type="search"
          placeholder="Song title or artist"
          icon={<Icon name="search" size="small" />}
          className="md:col-span-2"
          disabled
          aria-describedby="foundation-note"
        />
        <div className="field">
          <label htmlFor="genre" className="text-sm font-medium">
            Genre
          </label>
          <div className="field-control">
            <select
              id="genre"
              className="field-input"
              disabled
              aria-describedby="foundation-note"
              defaultValue="all"
            >
              <option value="all">All genres</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-border">
        <div
          aria-hidden="true"
          className="library-columns border-b border-border py-4 text-xs font-medium text-muted-foreground"
        >
          <span>Song</span>
          <span>Artist</span>
          <span>Genre</span>
          <span className="text-right">Duration</span>
        </div>
        <div className="flex min-h-empty items-center py-12">
          <EmptyState title="Your collection starts here">
            The song catalogue isn’t connected yet. Once it’s ready, you’ll
            find your tracks here, ready for a playlist of their own.
          </EmptyState>
        </div>
      </div>
    </section>
  );
}
