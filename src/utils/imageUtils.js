// Helper to generate a consistent integer from a string for image locking
const getStringHash = (str) => {
  let hash = 0;
  if (!str) return 1;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 1000) + 1;
};

export const getAvatarUrl = (name, providedUrl) => {
  if (providedUrl && providedUrl.trim() !== '') {
    return providedUrl;
  }
  const identifier = name ? encodeURIComponent(name.replace(/\s+/g, '')) : 'user';
  // i.pravatar.cc provides consistent human faces based on the string identifier
  return `https://i.pravatar.cc/150?u=${identifier}`;
};

export const getServiceImageUrl = (name, providedUrl) => {
  if (providedUrl && providedUrl.trim() !== '') {
    return providedUrl;
  }
  const lockId = getStringHash(name);
  // loremflickr provides context-specific photos (spa, salon, massage)
  return `https://loremflickr.com/400/300/spa,salon,massage?lock=${lockId}`;
};
