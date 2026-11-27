import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { validateSongs } from '../utils/songs.js';

export default function useSongs() {
  const [catalogue, setCatalogue] = useState({
    songs: [],
    status: 'loading',
  });
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setCatalogue({ songs: [], status: 'loading' });
    setAttempt((previous) => previous + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSongs() {
      try {
        const response = await axios.get(`${import.meta.env.BASE_URL}songs.json`, {
          signal: controller.signal,
          timeout: 10000,
        });
        const songs = validateSongs(response.data);

        if (!controller.signal.aborted) {
          setCatalogue({ songs, status: 'success' });
        }
      } catch (error) {
        if (!controller.signal.aborted && !axios.isCancel(error)) {
          setCatalogue({ songs: [], status: 'error' });
        }
      }
    }

    loadSongs();

    return () => controller.abort();
  }, [attempt]);

  return { ...catalogue, retry };
}
