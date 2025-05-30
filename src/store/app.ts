import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { STORAGE_KEY } from '@/constants/storage';

export const oneLevelTabSelectPathAtom = atom<string>('');

export const siderExpandAtom = atom<boolean>(true);
