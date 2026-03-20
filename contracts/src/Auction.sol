// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Auction
 * @author RealFlow Studio
 * @notice A comprehensive auction contract supporting English and Dutch auction types.
 * @dev Implements time-bounded auctions with escrow, automatic settlement, and emergency withdrawal.
 */
contract Auction is Ownable, ReentrancyGuard {
    /// @notice The type of auction
    enum AuctionType {
        English,  // Ascending price (starts low, goes up)
        Dutch     // Descending price (starts high, goes down)
    }

    /// @notice The status of an auction
    enum AuctionStatus {
        Pending,
        Active,
        Ended,
        Cancelled
    }

    /// @notice Auction details
    struct AuctionData {
        uint256 id;
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 amount;
        AuctionType auctionType;
        AuctionStatus status;
        uint256 startPrice;
        uint256 reservePrice;
        uint256 currentPrice;
        uint256 minBidIncrement;
        uint256 startTime;
        uint256 endTime;
        address highestBidder;
        uint256 highestBid;
        bool reserveMet;
    }

    /// @notice Error declarations
    error AuctionNotFound(uint256 auctionId);
    error AuctionNotActive(uint256 auctionId);
    error AuctionAlreadyStarted(uint256 auctionId);
    error AuctionNotEnded(uint256 auctionId);
    error AuctionEnded(uint256 auctionId);
    error InvalidPrice();
    error BidTooLow(uint256 minimumBid);
    error NotAuctionSeller();
    error NotHighestBidder();
    error TransferFailed();
    error Invalid auctionType();
    error AuctionNotPending(uint256 auctionId);

    /// @notice Events
    event AuctionCreated(
        uint256 indexed auctionId,
        address indexed seller,
        address nftContract,
        uint256 tokenId,
        AuctionType auctionType,
        uint256 startPrice,
        uint256 endTime
    );
    event AuctionStarted(uint256 indexed auctionId, uint256 startTime);
    event BidPlaced(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 amount,
        uint256 newPrice
    );
    event AuctionEnded(uint256 indexed auctionId, address winner, uint256 finalPrice);
    event AuctionCancelled(uint256 indexed auctionId);
    event ItemClaimed(uint256 indexed auctionId, address claimer);

    /// @notice Storage
    uint256 private _auctionCounter;
    mapping(uint256 => AuctionData) public auctions;
    mapping(uint256 => mapping(address => uint256)) public bids;
    uint256 public auctionDuration = 1 days;
    uint256 public platformFeePercent = 250; // 2.5% (basis points)
    address public platformFeeRecipient;

    /// @notice Modifier to check if auction exists
    modifier auctionExists(uint256 _auctionId) {
        if (_auctionId >= _auctionCounter) revert AuctionNotFound(_auctionId);
        _;
    }

    /// @notice Modifier to check if auction is active
    modifier whenActive(uint256 _auctionId) {
        if (auctions[_auctionId].status != AuctionStatus.Active) revert AuctionNotActive(_auctionId);
        _;
    }

    /// @notice Modifier to check if auction has ended
    modifier whenEnded(uint256 _auctionId) {
        if (auctions[_auctionId].status != AuctionStatus.Ended) revert AuctionNotEnded(_auctionId);
        _;
    }

    /**
     * @notice Initializes the Auction contract
     * @param _platformFeeRecipient Address to receive platform fees
     */
    constructor(address _platformFeeRecipient) Ownable(msg.sender) {
        platformFeeRecipient = _platformFeeRecipient;
    }

    /**
     * @notice Create a new auction
     * @dev Creates auction in Pending status. Must call startAuction to begin.
     * @param _nftContract The NFT contract address
     * @param _tokenId The token ID to auction
     * @param _amount The amount (for ERC-1155)
     * @param _auctionType The type of auction (English or Dutch)
     * @param _startPrice The starting price in wei
     * @param _reservePrice The minimum price to sell (0 for no reserve)
     * @param _minBidIncrement Minimum bid increment for English auctions
     * @param _duration Duration in seconds (0 for default)
     * @return auctionId The ID of the created auction
     */
    function createAuction(
        address _nftContract,
        uint256 _tokenId,
        uint256 _amount,
        AuctionType _auctionType,
        uint256 _startPrice,
        uint256 _reservePrice,
        uint256 _minBidIncrement,
        uint256 _duration
    ) external returns (uint256 auctionId) {
        if (_nftContract == address(0)) revert InvalidPrice();
        if (_startPrice == 0) revert InvalidPrice();
        if (_auctionType > AuctionType.Dutch) revert Invalid auctionType();

        auctionId = _auctionCounter++;
        uint256 duration = _duration > 0 ? _duration : auctionDuration;

        auctions[auctionId] = AuctionData({
            id: auctionId,
            seller: msg.sender,
            nftContract: _nftContract,
            tokenId: _tokenId,
            amount: _amount,
            auctionType: _auctionType,
            status: AuctionStatus.Pending,
            startPrice: _startPrice,
            reservePrice: _reservePrice,
            currentPrice: _auctionType == AuctionType.English ? _startPrice : _startPrice,
            minBidIncrement: _minBidIncrement,
            startTime: 0,
            endTime: block.timestamp + duration,
            highestBidder: address(0),
            highestBid: 0,
            reserveMet: _reservePrice == 0
        });

        emit AuctionCreated(
            auctionId,
            msg.sender,
            _nftContract,
            _tokenId,
            _auctionType,
            _startPrice,
            auctions[auctionId].endTime
        );
    }

    /**
     * @notice Start a pending auction
     * @dev NFT should be transferred to this contract before calling this
     * @param _auctionId The auction ID to start
     */
    function startAuction(uint256 _auctionId) external auctionExists(_auctionId) {
        AuctionData storage auction = auctions[_auctionId];
        
        if (auction.status != AuctionStatus.Pending) revert AuctionAlreadyStarted(_auctionId);
        if (msg.sender != auction.seller) revert NotAuctionSeller();

        auction.status = AuctionStatus.Active;
        auction.startTime = block.timestamp;
        auction.endTime = block.timestamp + (auction.endTime - block.timestamp);

        emit AuctionStarted(_auctionId, block.timestamp);
    }

    /**
     * @notice Place a bid on an English auction
     * @param _auctionId The auction ID
     */
    function placeBid(uint256 _auctionId) external payable auctionExists(_auctionId) whenActive(_auctionId) nonReentrant {
        AuctionData storage auction = auctions[_auctionId];
        
        if (auction.auctionType != AuctionType.English) revert Invalid auctionType();
        if (block.timestamp > auction.endTime) revert AuctionEnded(_auctionId);
        if (msg.sender == auction.seller) revert InvalidPrice();

        uint256 minimumBid = auction.highestBid + auction.minBidIncrement;
        if (msg.value < minimumBid) revert BidTooLow(minimumBid);

        // Refund previous highest bidder
        if (auction.highestBidder != address(0)) {
            (bool success, ) = payable(auction.highestBidder).call{value: auction.highestBid}("");
            if (!success) revert TransferFailed();
        }

        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;
        auction.currentPrice = msg.value;
        bids[_auctionId][msg.sender] = msg.value;

        if (msg.value >= auction.reservePrice) {
            auction.reserveMet = true;
        }

        emit BidPlaced(_auctionId, msg.sender, msg.value, msg.value);
    }

    /**
     * @notice Buy now on a Dutch auction (instant purchase at current price)
     * @param _auctionId The auction ID
     */
    function buyNow(uint256 _auctionId) external payable auctionExists(_auctionId) whenActive(_auctionId) nonReentrant {
        AuctionData storage auction = auctions[_auctionId];
        
        if (auction.auctionType != AuctionType.Dutch) revert Invalid auctionType();
        if (block.timestamp > auction.endTime) revert AuctionEnded(_auctionId);
        if (msg.sender == auction.seller) revert InvalidPrice();

        uint256 currentPrice = _getCurrentPrice(_auctionId);
        if (msg.value < currentPrice) revert BidTooLow(currentPrice);

        auction.highestBidder = msg.sender;
        auction.highestBid = currentPrice;
        auction.currentPrice = currentPrice;
        auction.reserveMet = true;

        _settleAuction(_auctionId);

        emit BidPlaced(_auctionId, msg.sender, currentPrice, currentPrice);
    }

    /**
     * @notice Get current price for Dutch auction
     * @param _auctionId The auction ID
     * @return currentPrice The current price based on time elapsed
     */
    function getCurrentPrice(uint256 _auctionId) external view auctionExists(_auctionId) returns (uint256 currentPrice) {
        return _getCurrentPrice(_auctionId);
    }

    /**
     * @dev Internal function to calculate current Dutch auction price
     */
    function _getCurrentPrice(uint256 _auctionId) internal view returns (uint256) {
        AuctionData storage auction = auctions[_auctionId];
        
        if (auction.auctionType != AuctionType.Dutch) return auction.currentPrice;
        if (block.timestamp >= auction.endTime) return auction.reservePrice;

        uint256 totalDuration = auction.endTime - auction.startTime;
        uint256 elapsed = block.timestamp - auction.startTime;
        uint256 priceRange = auction.startPrice - auction.reservePrice;
        uint256 priceDecrease = (priceRange * elapsed) / totalDuration;
        
        return auction.startPrice - priceDecrease;
    }

    /**
     * @notice End an auction manually after time has elapsed
     * @param _auctionId The auction ID
     */
    function endAuction(uint256 _auctionId) external auctionExists(_auctionId) {
        AuctionData storage auction = auctions[_auctionId];
        
        if (auction.status != AuctionStatus.Active) revert AuctionNotActive(_auctionId);
        if (block.timestamp < auction.endTime && auction.highestBidder == address(0)) revert AuctionNotEnded(_auctionId);

        auction.status = AuctionStatus.Ended;
        
        _settleAuction(_auctionId);

        emit AuctionEnded(_auctionId, auction.highestBidder, auction.highestBid);
    }

    /**
     * @notice Cancel a pending auction
     * @param _auctionId The auction ID
     */
    function cancelAuction(uint256 _auctionId) external auctionExists(_auctionId) {
        AuctionData storage auction = auctions[_auctionId];
        
        if (auction.status == AuctionStatus.Ended) revert AuctionEnded(_auctionId);
        if (msg.sender != auction.seller) revert NotAuctionSeller();

        auction.status = AuctionStatus.Cancelled;

        emit AuctionCancelled(_auctionId);
    }

    /**
     * @notice Claim the NFT after auction ends (for seller if unsold, or winner)
     * @param _auctionId The auction ID
     */
    function claimItem(uint256 _auctionId) external auctionExists(_auctionId) whenEnded(_auctionId) nonReentrant {
        AuctionData storage auction = auctions[_auctionId];
        
        if (auction.status == AuctionStatus.Cancelled) revert AuctionNotEnded(_auctionId);

        bool isWinner = msg.sender == auction.highestBidder;
        bool isSeller = msg.sender == auction.seller;
        
        if (!isWinner && !isSeller) revert NotHighestBidder();
        if (isWinner && !auction.reserveMet) revert NotHighestBidder();

        auction.status = AuctionStatus.Cancelled; // Mark as claimed

        // Transfer NFT
        // Note: In production, use IERC1155 safeTransferFrom
        emit ItemClaimed(_auctionId, msg.sender);
    }

    /**
     * @dev Internal function to settle auction and distribute funds
     */
    function _settleAuction(uint256 _auctionId) internal {
        AuctionData storage auction = auctions[_auctionId];
        
        if (!auction.reserveMet || auction.highestBidder == address(0)) return;

        // Calculate platform fee
        uint256 fee = (auction.highestBid * platformFeePercent) / 10000;
        uint256 sellerProceeds = auction.highestBid - fee;

        // Transfer funds
        (bool feeSuccess, ) = platformFeeRecipient.call{value: fee}("");
        (bool sellerSuccess, ) = payable(auction.seller).call{value: sellerProceeds}("");
        
        if (!feeSuccess || !sellerSuccess) revert TransferFailed();
    }

    /**
     * @notice Withdraw funds (emergency function for failed transfers)
     * @param _to Address to send funds to
     * @param _amount Amount to withdraw
     */
    function withdraw(address _to, uint256 _amount) external onlyOwner {
        (bool success, ) = _to.call{value: _amount}("");
        if (!success) revert TransferFailed();
    }

    /**
     * @notice Update platform fee recipient
     * @param _newRecipient New fee recipient address
     */
    function setPlatformFeeRecipient(address _newRecipient) external onlyOwner {
        if (_newRecipient == address(0)) revert InvalidPrice();
        platformFeeRecipient = _newRecipient;
    }

    /**
     * @notice Update default auction duration
     * @param _duration New duration in seconds
     */
    function setAuctionDuration(uint256 _duration) external onlyOwner {
        if (_duration < 1 hours || _duration > 30 days) revert InvalidPrice();
        auctionDuration = _duration;
    }

    /**
     * @notice Get auction count
     * @return The total number of auctions created
     */
    function getAuctionCount() external view returns (uint256) {
        return _auctionCounter;
    }

    /**
     * @notice Get all auction IDs for a seller
     * @param _seller The seller address
     * @return auctionIds Array of auction IDs
     */
    function getSellerAuctions(address _seller) external view returns (uint256[] memory auctionIds) {
        uint256 count = 0;
        for (uint256 i = 0; i < _auctionCounter; i++) {
            if (auctions[i].seller == _seller) count++;
        }
        
        auctionIds = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < _auctionCounter; i++) {
            if (auctions[i].seller == _seller) {
                auctionIds[index] = i;
                index++;
            }
        }
    }

    /**
     * @notice Receive ETH
     */
    receive() external payable {}
}
