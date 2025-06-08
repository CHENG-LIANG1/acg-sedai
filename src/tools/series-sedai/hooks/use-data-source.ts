import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { yuriDataSourceAtom } from '../store';
import { yuriTable } from '../data';
import type { YuriDataItem } from '../types';

/**
 * Custom hook to manage data source
 * Returns the custom data source if available, otherwise returns the default data
 */
export function useDataSource(): {
  data: YuriDataItem[];
  isCustomData: boolean;
} {
  const customDataSource = useAtomValue(yuriDataSourceAtom);

  const result = useMemo(() => {
    const data = customDataSource || yuriTable;
    const isCustomData = Boolean(customDataSource);

    return { data, isCustomData };
  }, [customDataSource]);

  return result;
}
