# Smart Contract Deployment Guide

## 📋 Overview

This guide walks you through deploying the PredictionMarket smart contract to BNB Smart Chain.

## 🔧 Prerequisites

1. **Install Dependencies**
```bash
yarn install
```

2. **Create .env file**
```bash
cp .env.example .env
```

3. **Configure .env**
```env
PRIVATE_KEY=your_private_key_here
BSCSCAN_API_KEY=your_bscscan_api_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_id
```

> ⚠️ **IMPORTANT**: Never commit your `.env` file! Keep your private key secure.

## 📝 Smart Contract Details

- **Admin Address**: `0x0425461847ea2825AFcA4573b2A99A02002F67a5`
- **Solidity Version**: 0.8.20
- **License**: MIT
- **Fee Structure**: 1% per market

## 🚀 Deployment Steps

### 1. Compile Contract

```bash
yarn compile
```

This will:
- Compile the Solidity contract
- Generate ABI and bytecode
- Create artifacts in `/artifacts` folder

### 2. Test Contract (Optional)

```bash
yarn test:contract
```

### 3. Deploy to BSC Testnet

```bash
yarn deploy:testnet
```

Expected output:
```
Deploying PredictionMarket contract...
✅ PredictionMarket deployed to: 0x...
📝 Admin address: 0x0425461847ea2825AFcA4573b2A99A02002F67a5
⏳ Waiting for block confirmations...
✅ Deployment confirmed!
🔍 Verifying contract on BSCScan...
✅ Contract verified on BSCScan
```

### 4. Deploy to BSC Mainnet

```bash
yarn deploy:mainnet
```

> ⚠️ **WARNING**: Deploying to mainnet costs real BNB. Make sure you have sufficient funds.

## 🔍 Verify Contract Manually

If automatic verification fails:

```bash
npx hardhat verify --network bscTestnet YOUR_CONTRACT_ADDRESS
```

## 📱 Update Frontend

After deployment, update the frontend with the contract address and ABI:

### 1. Copy Contract Address
From deployment output, copy the contract address.

### 2. Update wagmi Config

Create `app/contracts/config.ts`:
```typescript
export const PREDICTION_MARKET_ADDRESS = "0x..."; // Your deployed address
```

### 3. Export ABI

The ABI is automatically generated at:
```
artifacts/contracts/PredictionMarket.sol/PredictionMarket.json
```

Create `app/contracts/abi.ts`:
```typescript
export const PREDICTION_MARKET_ABI = [
  // Copy from artifacts/contracts/PredictionMarket.sol/PredictionMarket.json
] as const;
```

## 🧪 Testing on Testnet

### Get Testnet BNB

1. Visit [BNB Testnet Faucet](https://testnet.binance.org/faucet-smart)
2. Enter your wallet address
3. Receive testnet BNB

### Interact with Contract

Use BSC Testnet Explorer:
- [BSCScan Testnet](https://testnet.bscscan.com/)
- Search your contract address
- Go to "Write Contract" tab
- Connect your wallet
- Test functions

## 📊 Contract Functions

### Admin Functions
- `addAdmin(address)` - Add new admin
- `createMarket(title, endTimestamp)` - Create prediction market
- `endMarket(marketId, outcome)` - End market (1=YES, 2=NO)
- `removeMarket(marketId)` - Remove market
- `withdrawFees()` - Withdraw accumulated fees

### User Functions
- `predict(marketId, outcome)` - Place bet (send BNB)
- `claimReward(marketId)` - Claim winnings

### View Functions
- `getMarket(marketId)` - Get market info
- `getUserPrediction(marketId, user)` - Get user's bet
- `calculatePotentialReward(marketId, user)` - Calculate potential winnings

## 💰 Fee Structure

- **Platform Fee**: 1% of total pool
- **Reward Pool**: 99% distributed to winners
- **Distribution**: Proportional to bet size

### Example:
```
Total Pool: 10 BNB
- YES Pool: 4 BNB (4 users)
- NO Pool: 6 BNB (6 users)

Admin declares: YES wins

Calculations:
- Fee: 10 * 1% = 0.1 BNB (to feePool)
- Reward Pool: 10 - 0.1 = 9.9 BNB
- Each YES bettor gets: (their bet / 4 BNB) * 9.9 BNB

If User1 bet 1 BNB on YES:
- Reward: (1 / 4) * 9.9 = 2.475 BNB
- Profit: 2.475 - 1 = 1.475 BNB (+147.5%)
```

## 🔐 Security Considerations

1. **Private Key Security**
   - Never share your private key
   - Use hardware wallet for mainnet
   - Keep `.env` file secure

2. **Admin Functions**
   - Only trusted admins can manage markets
   - Owner cannot be removed
   - Multi-sig recommended for mainnet

3. **Testing**
   - Test thoroughly on testnet first
   - Verify all functions work correctly
   - Check gas costs

## 📚 Network Information

### BSC Testnet
- **Chain ID**: 97
- **RPC URL**: https://data-seed-prebsc-1-s1.binance.org:8545
- **Explorer**: https://testnet.bscscan.com
- **Currency**: tBNB

### BSC Mainnet
- **Chain ID**: 56
- **RPC URL**: https://bsc-dataseed.binance.org
- **Explorer**: https://bscscan.com
- **Currency**: BNB

## 🆘 Troubleshooting

### Deployment Fails
- Check you have enough BNB for gas
- Verify RPC endpoint is working
- Check network configuration

### Verification Fails
- Wait a few minutes after deployment
- Try manual verification
- Check BSCScan API key is valid

### Transaction Reverts
- Check function parameters
- Verify you have admin rights
- Ensure sufficient gas limit

## 📞 Support

For issues or questions:
- Check contract events in BSCScan
- Review transaction logs
- Test on testnet first

## ✅ Deployment Checklist

- [ ] Compiled contract successfully
- [ ] Tested on local hardhat network
- [ ] Deployed to BSC testnet
- [ ] Verified contract on BSCScan
- [ ] Tested all admin functions
- [ ] Tested user predictions
- [ ] Tested reward claiming
- [ ] Updated frontend config
- [ ] Ready for mainnet deployment

## 🎉 Post-Deployment

After successful deployment:

1. ✅ Save contract address
2. ✅ Update frontend configuration
3. ✅ Test all functions on testnet
4. ✅ Monitor gas costs
5. ✅ Prepare mainnet deployment
6. ✅ Set up monitoring/alerts
7. ✅ Document for team

Good luck! 🚀

