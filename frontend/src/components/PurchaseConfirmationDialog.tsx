import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { addPresalePurchase } from '../utils/presaleProgress';
import { useToast } from '@/hooks/use-toast';

interface PurchaseConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmPurchase: (amount: number) => void;
  token: any | null;
  getTokenCurrentStatus: (token: any) => string;
}

const PurchaseConfirmationDialog: React.FC<PurchaseConfirmationDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirmPurchase,
  token,
  getTokenCurrentStatus
}) => {
  const [amount, setAmount] = useState<string>('1');
  const { toast } = useToast();

  if (!token) return null;

  const status = getTokenCurrentStatus(token);
  const isFresh = token.isFresh || token.likes < 80;
  
  // Fixed price: presale tokens cost 0.01 SOL per token, launched tokens use their market price
  const tokenPrice = status === 'presale' ? 0.01 : parseFloat(token.price.replace('$', ''));
  const totalCost = parseFloat(amount) * tokenPrice;

  const handleConfirm = () => {
    const amountNum = parseFloat(amount);
    if (amountNum > 0) {
      // If it's a presale token and it's a user-created token, update the presale progress
      if (status === 'presale' && token.isUserCreated) {
        const solAmount = amountNum * 0.01; // 0.01 SOL per token
        addPresalePurchase(token.id.toString(), solAmount, amountNum);
        
        toast({
          title: "Purchase Successful!",
          description: `You bought ${amountNum} ${token.name} tokens for ${solAmount.toFixed(2)} SOL`,
        });
        
        // Force a page refresh to show updated progress
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      
      onConfirmPurchase(amountNum);
      setAmount('1'); // Reset amount
    }
  };

  // Don't show purchase dialog for fresh tokens
  if (isFresh) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Buy {token.name}</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the amount of {token.name} tokens you want to purchase.
            <br />
            <br />
            <div className="space-y-3">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium mb-1">
                  Amount of tokens:
                </label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  step="1"
                  placeholder="Enter amount"
                />
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Price per token:</span>
                  <span className="font-medium">
                    {status === 'presale' ? '0.01 SOL' : token.price}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Amount:</span>
                  <span className="font-medium">{amount} tokens</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t pt-2">
                  <span>Total Cost:</span>
                  <span>
                    {status === 'presale' 
                      ? `${totalCost.toFixed(2)} SOL`
                      : `$${totalCost.toFixed(6)}`
                    }
                  </span>
                </div>
                {status === 'presale' && token.isUserCreated && (
                  <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded mt-2">
                    💡 Your purchase will help this token reach its launch goal!
                  </div>
                )}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            Confirm Purchase
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PurchaseConfirmationDialog;
