/**
 * Milisaniyeyi kısa okunabilir bir süre metnine çevirir (örn. "3s 24dk").
 */
export function formatDuration(ms) {
  const value = Number(ms) || 0;
  if (value < 1000) return '0 sn';

  const totalSeconds = Math.floor(value / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}s`);
  if (minutes > 0) parts.push(`${minutes}dk`);
  if (hours === 0 && seconds > 0) parts.push(`${seconds}sn`);

  return parts.join(' ') || '0 sn';
}

/**
 * Bir tarihi "X dakika önce" gibi göreceli bir metne çevirir.
 */
export function timeAgo(date) {
  if (!date) return 'bilinmiyor';

  const diffMs = Date.now() - new Date(date).getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'az önce';
  if (diffMin < 60) return `${diffMin} dk önce`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} sa önce`;

  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} gün önce`;
}

/**
 * Discord kullanıcı adı yoksa ID'nin kısaltılmış halini döner.
 */
export function displayName(username, userId) {
  if (username) return username;
  if (!userId) return 'Bilinmeyen';
  return `ID: ${userId.slice(0, 6)}…`;
}
