import { useRef, useState } from 'react';
import { PLAYLIST_NAME_LIMIT } from '../utils/playlists.js';
import Button from './ui/Button.jsx';
import Input from './ui/Input.jsx';
import Modal from './ui/Modal.jsx';

export default function PlaylistDialog({
  mode,
  playlist,
  onSave,
  onDelete,
  onClose,
  fallbackFocusRef,
}) {
  const [name, setName] = useState(playlist?.name ?? '');
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const cancelRef = useRef(null);
  const isDelete = mode === 'delete';
  const isRename = mode === 'rename';
  const title = isDelete
    ? 'Delete playlist?'
    : isRename
      ? 'Rename playlist'
      : 'New playlist';

  function submit(event) {
    event.preventDefault();
    const validationError = onSave(name);
    if (validationError) {
      setError(validationError);
      inputRef.current?.focus();
    } else {
      onClose();
    }
  }

  return (
    <Modal
      title={title}
      initialFocusRef={isDelete ? cancelRef : inputRef}
      fallbackFocusRef={fallbackFocusRef}
      onClose={onClose}
      description={
        isDelete
          ? `“${playlist.name}” will be permanently removed. Songs in your library won’t be deleted.`
          : undefined
      }
    >
      {isDelete ? (
        <div className="modal-actions">
          <Button ref={cancelRef} variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(playlist.id);
              onClose();
            }}
          >
            Delete playlist
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="flex flex-col gap-6">
          <Input
            ref={inputRef}
            label="Playlist name"
            name="playlistName"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (error) setError('');
            }}
            maxLength={PLAYLIST_NAME_LIMIT}
            required
            autoComplete="off"
            hint="Choose a unique name."
            error={error}
          />
          <div className="modal-actions">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isRename ? 'Save changes' : 'Create playlist'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
