export const formatDisplayTime = (seconds: number) => {
  const ONE_MINUTE = 60;
  const minutes = Math.floor(seconds / ONE_MINUTE);
  const remainingSeconds = seconds % ONE_MINUTE;

  return (
    String(minutes).padStart(2, '0') +
    ':' +
    String(remainingSeconds).padStart(2, '0')
  );
};
