
import { rawTokens } from '../data/rawTokens';
import { defaultTokenStatus, generateTokenStatus } from '../data/tokenGenerator';

export const mergeTokenData = (customStatus = null) => {
  const statusData = customStatus || defaultTokenStatus;
  
  return rawTokens.map(token => {
    const status = statusData[token.id];
    return {
      ...token,
      likes: status?.likes || 0,
      status: status?.status || 'launched',
      progress: status?.progress || null,
      isFresh: status?.isFresh || false
    };
  });
};

export const randomizeTokenStatus = () => {
  return generateTokenStatus();
};
