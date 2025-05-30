// Cache keys
const CACHE_KEYS = {
  COUNTDOWN_DURATION: 'timer_countdown_duration',
  STOPWATCH_STATE: 'timer_stopwatch_state',
  LAST_MODE: 'timer_last_mode',
};

export const saveToCache = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
};

export const loadFromCache = <T>(key: string, defaultValue: T): T => {
  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : defaultValue;
  } catch (error) {
    console.error('Error loading from cache:', error);
    return defaultValue;
  }
};

export { CACHE_KEYS };