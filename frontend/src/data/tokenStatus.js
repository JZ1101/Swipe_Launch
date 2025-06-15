
export const tokenStatus = {
  1: { likes: 1247, status: "launched", progress: null },
  2: { likes: 892, status: "launched", progress: null },
  3: { likes: 567, status: "launched", progress: null },
  4: { likes: 1456, status: "launched", progress: null },
  5: { likes: 234, status: "launched", progress: null },
  6: { likes: 789, status: "launched", progress: null },
  7: { likes: 456, status: "launched", progress: null },
  8: { likes: 123, status: "launched", progress: null },
  9: { likes: 67, status: "presale", progress: 85 },
  10: { likes: 45, status: "presale", progress: 62 },
  11: { likes: 156, status: "launched", progress: null },
  12: { likes: 89, status: "presale", progress: 74 },
  13: { likes: 234, status: "launched", progress: null },
  14: { likes: 345, status: "launched", progress: null },
  15: { likes: 78, status: "presale", progress: 56 },
  16: { likes: 198, status: "launched", progress: null },
  17: { likes: 87, status: "presale", progress: 82 },
  18: { likes: 145, status: "launched", progress: null },
  19: { likes: 76, status: "presale", progress: 48 },
  20: { likes: 267, status: "launched", progress: null },
  21: { likes: 98, status: "presale", progress: 91 },
  22: { likes: 54, status: "presale", progress: 37 },
  23: { likes: 189, status: "launched", progress: null },
  24: { likes: 123, status: "launched", progress: null },
  25: { likes: 67, status: "presale", progress: 29 },
  26: { likes: 145, status: "launched", progress: null },
  27: { likes: 89, status: "presale", progress: 65 },
  28: { likes: 234, status: "launched", progress: null },
  29: { likes: 78, status: "presale", progress: 52 },
  30: { likes: 167, status: "launched", progress: null }
};

export const randomizeTokenStatus = () => {
  const newStatus = { ...tokenStatus };
  
  Object.keys(newStatus).forEach(id => {
    const randomChoice = Math.random();
    if (randomChoice < 0.4) {
      // 40% chance for presale
      const likes = Math.floor(Math.random() * 150) + 50; // 50-200 likes range
      newStatus[id] = {
        likes: likes,
        status: "presale", 
        progress: Math.floor(Math.random() * 90) + 10
      };
    } else {
      // 60% chance for launched
      newStatus[id] = {
        likes: Math.floor(Math.random() * 1500) + 50,
        status: "launched",
        progress: null
      };
    }
  });
  
  return newStatus;
};
