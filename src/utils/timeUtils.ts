export interface FormattedTime {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export const formatTime = (milliseconds: number): FormattedTime => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;
  const ms = Math.floor((milliseconds % 1000) / 10);
  
  return {
    hours,
    minutes,
    seconds,
    milliseconds: ms,
  };
};

export const padZero = (num: number): string => {
  return String(num).padStart(2, '0');
};