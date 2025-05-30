import { atomWithStorage } from 'jotai/utils';
import { STORAGE_KEY } from '@/constants/storage';

// Watched anime list atom with localStorage persistence
export const watchedAnimesAtom = atomWithStorage<string[]>(STORAGE_KEY.WATCHED_ANIME_LIST, []);
