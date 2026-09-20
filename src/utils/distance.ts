export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

export function formatDistance(distanceKm: number, language: "en" | "hi" = "en"): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return language === "hi" ? `${meters} मीटर दूर` : `${meters}m away`;
  }
  return language === "hi" ? `${distanceKm.toFixed(1)} किमी दूर` : `${distanceKm.toFixed(1)} km away`;
}

export function formatRelativeTime(timestamp: number, language: "en" | "hi" = "en"): string {
  const diffMinutes = Math.max(1, Math.floor((Date.now() - timestamp) / (60 * 1000)));
  if (diffMinutes < 60) {
    return language === "hi" ? `${diffMinutes} मिनट पहले` : `${diffMinutes}m ago`;
  }
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return language === "hi" ? `${diffHours} घंटे पहले` : `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return language === "hi" ? `${diffDays} दिन पहले` : `${diffDays}d ago`;
}
