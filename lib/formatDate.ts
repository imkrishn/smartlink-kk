export const formatDate = (input?: string | null): string | null => {
  if (!input) return null;

  const date = new Date(input);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
