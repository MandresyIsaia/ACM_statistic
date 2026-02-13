export function getDefaultFileName(ext: "pdf" | "xlsx" = "pdf"): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `analyse_statistic_${year}${month}${day}_${hours}${minutes}${seconds}.${ext}`;
}
