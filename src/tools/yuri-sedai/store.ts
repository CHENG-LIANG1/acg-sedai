import { atomWithStorage } from 'jotai/utils';
import { STORAGE_KEY } from '@/constants/storage';
import type { YuriDataItem } from './types';

// Watched anime list atom with localStorage persistence
export const watchedAnimesAtom = atomWithStorage<string[]>(STORAGE_KEY.WATCHED_ANIME_LIST, []);

// Custom data source atom with localStorage persistence
export const yuriDataSourceAtom = atomWithStorage<YuriDataItem[] | null>(STORAGE_KEY.YURI_ANIME_DATA_SOURCE, null);
