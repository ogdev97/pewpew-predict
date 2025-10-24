# PredictionMarket Smart Contract

A decentralized prediction market contract where users can bet on YES/NO outcomes, with automatic reward distribution and admin-controlled market management.

## Contract Address

**Admin Address**: `0x0425461847ea2825AFcA4573b2A99A02002F67a5`

## Features

### Admin Functions

1. **addAdmin(address _admin)** - Add new admin
2. **removeAdmin(address _admin)** - Remove admin (cannot remove owner)
3. **createMarket(string _title, uint256 _endTimestamp)** - Create new prediction market
4. **endMarket(uint256 _marketId, uint256 _winningOutcome)** - End market and declare winner
   - `_winningOutcome`: 1 = YES, 2 = NO
5. **removeMarket(uint256 _marketId)** - Cancel market (only if no bets)
6. **withdrawFees()** - Withdraw accumulated fees (1% of all pools)

### User Functions

1. **predict(uint256 _marketId, uint256 _outcome)** - Place bet on market
   - `_outcome`: 1 = YES, 2 = NO
   - Send BNB value with transaction
   - Can only predict once per market
2. **claimReward(uint256 _marketId)** - Claim winnings after market ends

### View Functions

1. **getMarket(uint256 _marketId)** - Get market details
2. **getUserPrediction(uint256 _marketId, address _user)** - Get user's bet
3. **calculatePotentialReward(uint256 _marketId, address _user)** - Calculate potential winnings
4. **getParticipantCount(uint256 _marketId, Outcome _outcome)** - Get bet counts
5. **isAdmin(address _address)** - Check admin status
6. **getContractBalance()** - Get total contract balance

## How It Works

### Market Creation
1. Admin creates market with title and end timestamp
2. Market ID is auto-incremented
3. Market status = ACTIVE

### Betting Phase
1. Users call `predict()` with marketId and outcome (1 or 2)
2. Send BNB value with transaction
3. Each user can only bet once per market
4. Bets accumulate in YES pool or NO pool

### Market Settlement
1. Admin calls `endMarket()` with winning outcome
2. Contract calculates:
   - Total pool = YES pool + NO pool
   - Fee (1%) goes to feePool
   - Reward pool (99%) distributed to winners

### Claiming Rewards
1. Winners call `claimReward()`
2. Reward = (user's bet / winning pool) * reward pool
3. Proportional distribution based on bet size

## Fee Structure

- **1% Fee** on total pool
- Fee accumulates in `feePool`
- Only admins can withdraw fees
- **99% Reward Pool** distributed to winners

## Example

```solidity
// Create Market
createMarket("Will BNB reach $1000?", 1735689600) // Dec 31, 2025

// Users Predict
predict(1, 1) // Bet 1 BNB on YES
predict(1, 2) // Bet 2 BNB on NO

// Market State:
// YES Pool: 1 BNB
// NO Pool: 2 BNB
// Total: 3 BNB

// Admin Ends Market
endMarket(1, 1) // YES wins

// Calculations:
// Fee: 3 * 1% = 0.03 BNB (to feePool)
// Reward Pool: 3 - 0.03 = 2.97 BNB
// Winner gets: 2.97 BNB (100% since only YES better)

// Claim Reward
claimReward(1) // User receives 2.97 BNB
```

## Security Features

- ✅ Only admins can manage markets
- ✅ Cannot remove owner admin
- ✅ One prediction per user per market
- ✅ Markets must end before timestamp
- ✅ Cannot remove markets with active bets
- ✅ ReentrancyGuard on withdrawals
- ✅ Safe transfer patterns

## Deployment

### Prerequisites
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

### Compile
```bash
npx hardhat compile
```

### Deploy to BSC Testnet
```bash
npx hardhat run scripts/deploy.js --network bscTestnet
```

### Deploy to BSC Mainnet
```bash
npx hardhat run scripts/deploy.js --network bsc
```

## Testing

```bash
npx hardhat test
```

## Gas Estimates

- Create Market: ~150,000 gas
- Predict: ~120,000 gas
- End Market: ~80,000 gas
- Claim Reward: ~60,000 gas

## Events

- `AdminAdded(address admin)`
- `AdminRemoved(address admin)`
- `MarketCreated(uint256 marketId, string title, uint256 endTimestamp)`
- `MarketEnded(uint256 marketId, Outcome winningOutcome)`
- `MarketRemoved(uint256 marketId)`
- `PredictionPlaced(uint256 marketId, address user, Outcome outcome, uint256 amount)`
- `RewardClaimed(uint256 marketId, address user, uint256 amount)`
- `FeeWithdrawn(address admin, uint256 amount)`

## License

MIT

