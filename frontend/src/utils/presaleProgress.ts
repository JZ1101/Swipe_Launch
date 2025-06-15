
export interface PresaleData {
  poolAmount: number;
  targetPool: number;
  investorCount: number;
  totalInvested: number;
  purchases: PurchaseRecord[];
}

export interface PurchaseRecord {
  id: string;
  amount: number;
  solAmount: number;
  timestamp: string;
  userId: string;
}

export const calculateProgress = (poolAmount: number, targetPool: number): number => {
  return Math.min((poolAmount / targetPool) * 100, 100);
};

export const addPresalePurchase = (tokenId: string, solAmount: number, tokenAmount: number): void => {
  const userUploads = JSON.parse(localStorage.getItem('userUploads') || '[]');
  const updatedUploads = userUploads.map((token: any) => {
    if (token.id === tokenId) {
      const newPoolAmount = (token.poolAmount || 0) + solAmount;
      const newProgress = calculateProgress(newPoolAmount, token.targetPool || 100);
      
      const purchase: PurchaseRecord = {
        id: Date.now().toString(),
        amount: tokenAmount,
        solAmount: solAmount,
        timestamp: new Date().toISOString(),
        userId: 'current-user'
      };

      const purchases = token.purchases || [];
      const newStatus = newProgress >= 100 ? 'launched' : 'presale';

      return {
        ...token,
        poolAmount: newPoolAmount,
        progress: newProgress,
        status: newStatus,
        investorCount: (token.investorCount || 0) + 1,
        totalInvested: (token.totalInvested || 0) + solAmount,
        purchases: [...purchases, purchase]
      };
    }
    return token;
  });

  localStorage.setItem('userUploads', JSON.stringify(updatedUploads));
};

export const getPresaleStatus = (token: any): { progress: number; status: string; canLaunch: boolean } => {
  const progress = calculateProgress(token.poolAmount || 0, token.targetPool || 100);
  const canLaunch = progress >= 100;
  const status = canLaunch ? 'launched' : 'presale';
  
  return { progress, status, canLaunch };
};
