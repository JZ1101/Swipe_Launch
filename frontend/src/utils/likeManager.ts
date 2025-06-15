
// Centralized like management
let globalLikes: Record<number, number> = {};

export const initializeLikes = (tokens: any[]) => {
  tokens.forEach(token => {
    if (globalLikes[token.id] === undefined) {
      globalLikes[token.id] = token.likes || 0;
    }
  });
};

export const addLike = (tokenId: number) => {
  globalLikes[tokenId] = (globalLikes[tokenId] || 0) + 1;
  console.log(`Token ${tokenId} now has ${globalLikes[tokenId]} likes`);
  return globalLikes[tokenId];
};

export const getLikes = (tokenId: number) => {
  return globalLikes[tokenId] || 0;
};

export const getAllLikes = () => {
  return { ...globalLikes };
};

export const resetLikes = () => {
  globalLikes = {};
};
