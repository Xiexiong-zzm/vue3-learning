import {ref,watch} from 'vue'

export function useLocalStorage<T>(key: string,defaultValue: T) {
  let initialValue = defaultValue

  try {
    const storedValue = localStorage.getItem(key)
    if (storedValue) {
      initialValue = JSON.parse(storedValue)
    }
  } catch (error) {
    console.warn(`Failed to parse localStorage key "${key}"`)
  }
  const data = ref<T>(initialValue);

  watch(
    data,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    {deep: true}
  );

  return data
}