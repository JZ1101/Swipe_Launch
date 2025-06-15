
export const generateTokenStatus = () => {
  const tokenStatus = {};
  
  for (let id = 1; id <= 30; id++) {
    const randomChoice = Math.random();
    
    if (randomChoice < 0.4) {
      // 40% chance for presale
      const likes = Math.floor(Math.random() * 150) + 50; // 50-200 likes range
      tokenStatus[id] = {
        likes: likes,
        status: "presale", 
        progress: Math.floor(Math.random() * 90) + 10,
        isFresh: likes < 80
      };
    } else {
      // 60% chance for launched
      const likes = Math.floor(Math.random() * 1500) + 50;
      tokenStatus[id] = {
        likes: likes,
        status: "launched",
        progress: null,
        isFresh: likes < 80
      };
    }
  }
  
  return tokenStatus;
};

// Default status data
export const defaultTokenStatus = {
  1: { likes: 1247, status: "launched", progress: null, isFresh: false },
  2: { likes: 892, status: "launched", progress: null, isFresh: false },
  3: { likes: 567, status: "launched", progress: null, isFresh: false },
  4: { likes: 1456, status: "launched", progress: null, isFresh: false },
  5: { likes: 234, status: "launched", progress: null, isFresh: false },
  6: { likes: 789, status: "launched", progress: null, isFresh: false },
  7: { likes: 456, status: "launched", progress: null, isFresh: false },
  8: { likes: 123, status: "launched", progress: null, isFresh: false },
  9: { likes: 67, status: "presale", progress: 85, isFresh: true },
  10: { likes: 45, status: "presale", progress: 62, isFresh: true },
  11: { likes: 156, status: "launched", progress: null, isFresh: false },
  12: { likes: 89, status: "presale", progress: 74, isFresh: false },
  13: { likes: 234, status: "launched", progress: null, isFresh: false },
  14: { likes: 345, status: "launched", progress: null, isFresh: false },
  15: { likes: 78, status: "presale", progress: 56, isFresh: true },
  16: { likes: 198, status: "launched", progress: null, isFresh: false },
  17: { likes: 87, status: "presale", progress: 82, isFresh: false },
  18: { likes: 145, status: "launched", progress: null, isFresh: false },
  19: { likes: 76, status: "presale", progress: 48, isFresh: true },
  20: { likes: 267, status: "launched", progress: null, isFresh: false },
  21: { likes: 98, status: "presale", progress: 91, isFresh: false },
  22: { likes: 54, status: "presale", progress: 37, isFresh: true },
  23: { likes: 189, status: "launched", progress: null, isFresh: false },
  24: { likes: 123, status: "launched", progress: null, isFresh: false },
  25: { likes: 67, status: "presale", progress: 29, isFresh: true },
  26: { likes: 145, status: "launched", progress: null, isFresh: false },
  27: { likes: 89, status: "presale", progress: 65, isFresh: false },
  28: { likes: 234, status: "launched", progress: null, isFresh: false },
  29: { likes: 78, status: "presale", progress: 52, isFresh: true },
  30: { likes: 167, status: "launched", progress: null, isFresh: false }
};
