// Tempo relativo em português — usado nos cards e no histórico.
export function relativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `há ${diffMin} min`;

  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `há ${diffH}h`;

  const diffD = Math.round(diffH / 24);
  if (diffD < 7) return `há ${diffD}d`;

  return new Date(isoDate).toLocaleDateString("pt-BR");
}
