export const cleanup = (timeout) => {
  if (timeout) clearTimeout(timeout);
};