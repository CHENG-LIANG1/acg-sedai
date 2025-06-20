import { useRef, useEffect, useCallback } from 'react';
import { throttle } from 'es-toolkit';

/**
 * 它返回传入函数的节流版本，每 `delay` 毫秒仅调用一次
 * @param {any} fn - 节流功能
 * @param [delay=300] - 调用受限函数之间等待的时间量。
 * @returns 一个被 300ms 限制的函数
 */
export function useThrottle(fn: any, delay = 300) {
  const fnRef = useRef(fn);
  // use mutable ref to make useCallback/throttle not depend on `fn` dep
  useEffect(() => {
    fnRef.current = fn;
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    throttle((...args: any[]) => fnRef.current(...args), delay),
    [delay],
  );
}
