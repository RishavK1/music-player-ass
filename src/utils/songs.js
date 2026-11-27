export function validateSongs(data) {
  if (!Array.isArray(data)) {
    throw new Error('The song catalogue must be an array.');
  }

  const ids = new Set();

  return data.map((song) => {
    if (
      !song ||
      typeof song !== 'object' ||
      !['id', 'title', 'artist', 'genre'].every(
        (key) => typeof song[key] === 'string' && song[key].trim().length > 0,
      ) ||
      !Number.isSafeInteger(song.duration) ||
      song.duration < 0
    ) {
      throw new Error('The song catalogue contains an invalid song.');
    }

    const id = song.id.trim();

    if (ids.has(id)) {
      throw new Error('Song IDs must be unique.');
    }

    ids.add(id);

    return {
      id,
      title: song.title.trim(),
      artist: song.artist.trim(),
      genre: song.genre.trim(),
      duration: song.duration,
    };
  });
}

export function filterSongs(songs, query, genre) {
  const search = query.trim().toLowerCase();

  return songs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(search) ||
      song.artist.toLowerCase().includes(search);
    const matchesGenre = !genre || song.genre === genre;

    return matchesSearch && matchesGenre;
  });
}

export function getGenres(songs) {
  return [...new Set(songs.map((song) => song.genre))].sort((a, b) =>
    a.localeCompare(b),
  );
}
