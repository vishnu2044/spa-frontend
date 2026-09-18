export const getAvatarUrl = (name, providedUrl) => {
  if (providedUrl && providedUrl.trim() !== '') {
    return providedUrl;
  }
  
  if (!name) return 'https://ui-avatars.com/api/?name=User&background=random';
  
  // Create a nice fallback image based on initials
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=150`;
};
