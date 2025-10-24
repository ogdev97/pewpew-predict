# Smart Contract Integration Guide

## 📋 Overview

The SwipeCards component is now fully integrated with the PredictionMarket smart contract using wagmi v2 and RainbowKit.

## 🔧 What Was Implemented

### 1. **Contract Configuration**

**File: `app/contracts/config.ts`**
```typescript
export const PREDICTION_MARKET_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
export const DEFAULT_BET_AMOUNT = '0.001'; // 0.001 BNB default
```

**File: `app/contracts/abi.ts`**
- Full contract ABI exported
- Type-safe with `as const`

### 2. **Swipe-to-Predict Logic**

**When user swipes:**
1. **Right Swipe** → Calls `predict(marketId, 1, value: betAmount)` → YES
2. **Left Swipe** → Calls `predict(marketId, 2, value: betAmount)` → NO

**Implementation:**
```typescript
writeContract({
  address: PREDICTION_MARKET_ADDRESS,
  abi: PREDICTION_MARKET_ABI,
  functionName: 'predict',
  args: [BigInt(currentCard.id), BigInt(outcome)],
  value: parseEther(betAmount),
});
```

### 3. **UI Features Added**

✅ **Bet Amount Input**
- Default: 0.001 BNB
- Quick buttons: 0.01, 0.1 BNB
- Min: 0.001 BNB (contract minimum)

✅ **Transaction Status**
- ⏳ Waiting for wallet confirmation
- ⏳ Transaction confirming on-chain
- ✅ Success message
- ❌ Error display

✅ **Card Locking**
- Cards disabled during transaction
- Visual feedback (opacity, cursor)
- Prevents multiple simultaneous predictions

✅ **Market ID Badge**
- Shows "Market #1", "Market #2", etc.
- Visible on each card

## 🚀 Setup Instructions

### Step 1: Deploy Contract

```bash
# Deploy to BSC Testnet
yarn deploy:testnet

# Copy the deployed contract address
```

### Step 2: Configure Environment

Create `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Your deployed address
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=... # WalletConnect ID
```

### Step 3: Run App

```bash
yarn dev
```

Visit `http://localhost:3000`

## 📱 User Flow

1. **Connect Wallet** (RainbowKit button)
2. **Set Bet Amount** (default 0.001 BNB)
3. **Swipe Card**:
   - Right = YES (outcome: 1)
   - Left = NO (outcome: 2)
4. **Confirm in Wallet** (MetaMask, etc.)
5. **Wait for Confirmation** (~3-5 seconds on BSC)
6. **Next Card Loads**

## 🔍 Technical Details

### Contract Function Called

```solidity
function predict(
    uint256 _marketId,
    uint256 _outcome  // 1 = YES, 2 = NO
) external payable;
```

### Parameters

| Parameter | Type | Value | Description |
|-----------|------|-------|-------------|
| `_marketId` | uint256 | `card.id` | Market identifier (1, 2, 3, 4) |
| `_outcome` | uint256 | `1 or 2` | 1 = YES, 2 = NO |
| `value` | BNB | `betAmount` | Bet amount in BNB (min 0.001) |

### Event Emitted

```solidity
event PredictionPlaced(
    uint256 indexed marketId,
    address indexed user,
    Outcome outcome,
    uint256 amount
);
```

## 🎯 Testing Checklist

### Before Testing
- [ ] Contract deployed to testnet
- [ ] Contract address in `.env.local`
- [ ] Testnet BNB in wallet
- [ ] Wallet connected

### Test Cases
- [ ] Swipe right (YES) with 0.001 BNB
- [ ] Swipe left (NO) with 0.01 BNB
- [ ] Try to predict on same market twice (should fail)
- [ ] Check transaction on BSCScan
- [ ] Verify event emission
- [ ] Test with insufficient balance
- [ ] Test wallet rejection

## 🐛 Troubleshooting

### Error: "Market does not exist"
**Cause:** Market ID in frontend doesn't match contract
**Solution:** Admin must create markets 1-4 using `createMarket()`

### Error: "Already predicted"
**Cause:** User already bet on this market
**Solution:** Each user can only predict once per market

### Error: "Bet amount must be > 0"
**Cause:** Bet amount is 0 or too small
**Solution:** Minimum is 0.001 BNB (set in contract)

### Transaction Pending Forever
**Cause:** Gas too low or network congestion
**Solution:** Increase gas limit or try again

### Contract Address is 0x000...
**Cause:** Environment variable not set
**Solution:** Set `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`

## 📊 Gas Estimates

| Action | Gas Used | Cost (20 Gwei) |
|--------|----------|----------------|
| First Prediction | ~120,000 | ~0.0024 BNB |
| Subsequent | ~100,000 | ~0.002 BNB |

## 🔐 Security Notes

1. **Contract Validation**
   - Market must exist
   - Market must be active
   - User can't predict twice
   - Timestamp validation

2. **Frontend Validation**
   - Wallet must be connected
   - Transaction must complete before next swipe
   - Bet amount minimum enforced

3. **Error Handling**
   - Try-catch blocks
   - User-friendly error messages
   - Transaction status tracking

## 🎨 UI States

| State | Visual | Interaction |
|-------|--------|-------------|
| **Idle** | Normal card | Swipeable |
| **Pending** | Opacity 60%, "⏳ Waiting..." | Disabled |
| **Confirming** | Opacity 60%, "⏳ Confirming..." | Disabled |
| **Success** | "✅ Success!", next card | Enabled again |
| **Error** | Red error message | Enabled again |

## 📈 Next Steps

### Phase 1: Current ✅
- [x] Basic predict functionality
- [x] Transaction status
- [x] Bet amount input
- [x] Error handling

### Phase 2: Enhancement
- [ ] Read market data from contract
- [ ] Display real-time odds
- [ ] Show user's past predictions
- [ ] Claim rewards UI

### Phase 3: Advanced
- [ ] Market creation UI (admin)
- [ ] End market UI (admin)
- [ ] Real-time event listening
- [ ] Notification system

## 💡 Tips

1. **Testing on Testnet First**
   - Always test on BSC Testnet
   - Get free tBNB from faucet
   - Verify all functions work

2. **Gas Optimization**
   - Use default gas settings
   - Batch transactions if possible
   - Monitor gas prices

3. **User Experience**
   - Clear error messages
   - Transaction status always visible
   - Prevent accidental double-predictions

4. **Monitoring**
   - Watch contract events
   - Track transaction hashes
   - Monitor for failures

## 🆘 Support

For issues:
1. Check console logs
2. View transaction on BSCScan
3. Verify contract deployment
4. Check wallet connection
5. Ensure sufficient balance

## 📞 Contract Functions Available

### User Functions
- ✅ `predict(marketId, outcome)` - Implemented
- ⏳ `claimReward(marketId)` - TODO
- ⏳ `getUserPrediction(marketId, user)` - TODO

### Admin Functions (Not in UI yet)
- `createMarket(title, endTimestamp)`
- `endMarket(marketId, winningOutcome)`
- `removeMarket(marketId)`
- `withdrawFees()`

---

**Status:** ✅ Ready for testnet deployment and testing!

