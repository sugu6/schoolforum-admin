import { ref, type Ref } from 'vue';
import { DEBOUNCE_DELAY } from '@/utils/constants';

/**
 * 防抖函数
 * @param fn 需要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = DEBOUNCE_DELAY
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * 防抖 Ref
 * 用于防抖处理输入框等频繁变化的响应式值
 */
export function useDebouncedRef<T>(initialValue: T, delay: number = DEBOUNCE_DELAY): Ref<T> {
  const debouncedValue = ref(initialValue) as Ref<T>;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return debouncedValue;
}
