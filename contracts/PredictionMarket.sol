// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PredictionMarket
 * @dev Decentralized prediction market where users can bet on YES/NO outcomes
 */
contract PredictionMarket {
    
    // ============ State Variables ============
    
    address public owner;
    uint256 public marketCounter;
    uint256 public feePool;
    uint256 public constant FEE_PERCENTAGE = 1; // 1% fee
    
    mapping(address => bool) public admins;
    
    enum Outcome { NONE, YES, NO }
    enum MarketStatus { ACTIVE, ENDED, CANCELLED }
    
    struct Market {
        uint256 marketId;
        string title;
        uint256 endTimestamp;
        uint256 totalYesAmount;
        uint256 totalNoAmount;
        Outcome winningOutcome;
        MarketStatus status;
        bool exists;
    }
    
    struct Prediction {
        Outcome outcome;
        uint256 amount;
        bool claimed;
    }
    
    // marketId => Market
    mapping(uint256 => Market) public markets;
    
    // marketId => user => Prediction
    mapping(uint256 => mapping(address => Prediction)) public predictions;
    
    // marketId => outcome => users[]
    mapping(uint256 => mapping(Outcome => address[])) public marketParticipants;
    
    // ============ Events ============
    
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event MarketCreated(uint256 indexed marketId, string title, uint256 endTimestamp);
    event MarketEnded(uint256 indexed marketId, Outcome winningOutcome);
    event MarketRemoved(uint256 indexed marketId);
    event PredictionPlaced(uint256 indexed marketId, address indexed user, Outcome outcome, uint256 amount);
    event RewardClaimed(uint256 indexed marketId, address indexed user, uint256 amount);
    event FeeWithdrawn(address indexed admin, uint256 amount);
    
    // ============ Modifiers ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admin");
        _;
    }
    
    modifier marketExists(uint256 _marketId) {
        require(markets[_marketId].exists, "Market does not exist");
        _;
    }
    
    modifier marketActive(uint256 _marketId) {
        require(markets[_marketId].status == MarketStatus.ACTIVE, "Market not active");
        _;
    }
    
    modifier marketEnded(uint256 _marketId) {
        require(markets[_marketId].status == MarketStatus.ENDED, "Market not ended");
        _;
    }
    
    // ============ Constructor ============
    
    constructor() {
        owner = 0x0425461847ea2825AFcA4573b2A99A02002F67a5;
        admins[owner] = true;
        emit AdminAdded(owner);
    }
    
    // ============ Admin Functions ============
    
    /**
     * @dev Add a new admin
     * @param _admin Address to grant admin rights
     */
    function addAdmin(address _admin) external onlyAdmin {
        require(_admin != address(0), "Invalid address");
        require(!admins[_admin], "Already admin");
        
        admins[_admin] = true;
        emit AdminAdded(_admin);
    }
    
    /**
     * @dev Remove an admin
     * @param _admin Address to revoke admin rights
     */
    function removeAdmin(address _admin) external onlyAdmin {
        require(_admin != owner, "Cannot remove owner");
        require(admins[_admin], "Not an admin");
        
        admins[_admin] = false;
        emit AdminRemoved(_admin);
    }
    
    /**
     * @dev Create a new prediction market
     * @param _title Market title/question
     * @param _endTimestamp When the market should end
     */
    function createMarket(
        string memory _title,
        uint256 _endTimestamp
    ) external onlyAdmin returns (uint256) {
        require(_endTimestamp > block.timestamp, "End time must be in future");
        require(bytes(_title).length > 0, "Title cannot be empty");
        
        marketCounter++;
        uint256 newMarketId = marketCounter;
        
        markets[newMarketId] = Market({
            marketId: newMarketId,
            title: _title,
            endTimestamp: _endTimestamp,
            totalYesAmount: 0,
            totalNoAmount: 0,
            winningOutcome: Outcome.NONE,
            status: MarketStatus.ACTIVE,
            exists: true
        });
        
        emit MarketCreated(newMarketId, _title, _endTimestamp);
        return newMarketId;
    }
    
    /**
     * @dev End a market and set the winning outcome
     * @param _marketId Market to end
     * @param _winningOutcome 1 for YES, 2 for NO
     */
    function endMarket(
        uint256 _marketId,
        uint256 _winningOutcome
    ) external onlyAdmin marketExists(_marketId) marketActive(_marketId) {
        require(_winningOutcome == 1 || _winningOutcome == 2, "Invalid outcome");
        
        Market storage market = markets[_marketId];
        market.status = MarketStatus.ENDED;
        market.winningOutcome = _winningOutcome == 1 ? Outcome.YES : Outcome.NO;
        
        // Calculate fee
        uint256 totalPool = market.totalYesAmount + market.totalNoAmount;
        uint256 fee = (totalPool * FEE_PERCENTAGE) / 100;
        feePool += fee;
        
        emit MarketEnded(_marketId, market.winningOutcome);
    }
    
    /**
     * @dev Remove/cancel a market (only if no bets placed)
     * @param _marketId Market to remove
     */
    function removeMarket(uint256 _marketId) external onlyAdmin marketExists(_marketId) {
        Market storage market = markets[_marketId];
        require(market.totalYesAmount == 0 && market.totalNoAmount == 0, "Market has bets");
        
        market.status = MarketStatus.CANCELLED;
        emit MarketRemoved(_marketId);
    }
    
    /**
     * @dev Withdraw accumulated fees from feePool
     */
    function withdrawFees() external onlyAdmin {
        require(feePool > 0, "No fees to withdraw");
        
        uint256 amount = feePool;
        feePool = 0;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit FeeWithdrawn(msg.sender, amount);
    }
    
    // ============ User Functions ============
    
    /**
     * @dev Place a prediction on a market
     * @param _marketId Market to predict on
     * @param _outcome 1 for YES, 2 for NO
     */
    function predict(
        uint256 _marketId,
        uint256 _outcome
    ) external payable marketExists(_marketId) marketActive(_marketId) {
        require(_outcome == 1 || _outcome == 2, "Invalid outcome");
        require(msg.value > 0, "Bet amount must be > 0");
        require(block.timestamp < markets[_marketId].endTimestamp, "Market ended");
        require(predictions[_marketId][msg.sender].amount == 0, "Already predicted");
        
        Outcome outcome = _outcome == 1 ? Outcome.YES : Outcome.NO;
        Market storage market = markets[_marketId];
        
        // Update market totals
        if (outcome == Outcome.YES) {
            market.totalYesAmount += msg.value;
        } else {
            market.totalNoAmount += msg.value;
        }
        
        // Record user prediction
        predictions[_marketId][msg.sender] = Prediction({
            outcome: outcome,
            amount: msg.value,
            claimed: false
        });
        
        // Track participants
        marketParticipants[_marketId][outcome].push(msg.sender);
        
        emit PredictionPlaced(_marketId, msg.sender, outcome, msg.value);
    }
    
    /**
     * @dev Claim rewards from a winning prediction
     * @param _marketId Market to claim from
     */
    function claimReward(uint256 _marketId) external marketExists(_marketId) marketEnded(_marketId) {
        Prediction storage prediction = predictions[_marketId][msg.sender];
        require(prediction.amount > 0, "No prediction found");
        require(!prediction.claimed, "Already claimed");
        require(prediction.outcome == markets[_marketId].winningOutcome, "Not a winner");
        
        Market storage market = markets[_marketId];
        
        // Calculate reward
        uint256 totalPool = market.totalYesAmount + market.totalNoAmount;
        uint256 feeAmount = (totalPool * FEE_PERCENTAGE) / 100;
        uint256 rewardPool = totalPool - feeAmount;
        
        uint256 winningPool = market.winningOutcome == Outcome.YES 
            ? market.totalYesAmount 
            : market.totalNoAmount;
        
        require(winningPool > 0, "No winning pool");
        
        uint256 reward = (prediction.amount * rewardPool) / winningPool;
        
        prediction.claimed = true;
        
        (bool success, ) = payable(msg.sender).call{value: reward}("");
        require(success, "Transfer failed");
        
        emit RewardClaimed(_marketId, msg.sender, reward);
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get market details
     */
    function getMarket(uint256 _marketId) external view returns (
        uint256 marketId,
        string memory title,
        uint256 endTimestamp,
        uint256 totalYesAmount,
        uint256 totalNoAmount,
        Outcome winningOutcome,
        MarketStatus status
    ) {
        Market storage market = markets[_marketId];
        require(market.exists, "Market does not exist");
        
        return (
            market.marketId,
            market.title,
            market.endTimestamp,
            market.totalYesAmount,
            market.totalNoAmount,
            market.winningOutcome,
            market.status
        );
    }
    
    /**
     * @dev Get user's prediction for a market
     */
    function getUserPrediction(uint256 _marketId, address _user) external view returns (
        Outcome outcome,
        uint256 amount,
        bool claimed
    ) {
        Prediction storage prediction = predictions[_marketId][_user];
        return (prediction.outcome, prediction.amount, prediction.claimed);
    }
    
    /**
     * @dev Calculate potential reward for a user
     */
    function calculatePotentialReward(uint256 _marketId, address _user) external view returns (uint256) {
        Prediction storage prediction = predictions[_marketId][_user];
        if (prediction.amount == 0) return 0;
        
        Market storage market = markets[_marketId];
        if (market.status != MarketStatus.ENDED) return 0;
        if (prediction.outcome != market.winningOutcome) return 0;
        if (prediction.claimed) return 0;
        
        uint256 totalPool = market.totalYesAmount + market.totalNoAmount;
        uint256 feeAmount = (totalPool * FEE_PERCENTAGE) / 100;
        uint256 rewardPool = totalPool - feeAmount;
        
        uint256 winningPool = market.winningOutcome == Outcome.YES 
            ? market.totalYesAmount 
            : market.totalNoAmount;
        
        if (winningPool == 0) return 0;
        
        return (prediction.amount * rewardPool) / winningPool;
    }
    
    /**
     * @dev Get total participants for a market outcome
     */
    function getParticipantCount(uint256 _marketId, Outcome _outcome) external view returns (uint256) {
        return marketParticipants[_marketId][_outcome].length;
    }
    
    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Check if address is admin
     */
    function isAdmin(address _address) external view returns (bool) {
        return admins[_address];
    }
    
    // ============ Fallback ============
    
    receive() external payable {}
}

