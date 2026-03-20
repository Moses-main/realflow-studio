// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";


/**
 * @title RWATokenizer
 * @author RealFlow Studio
 * @notice A contract for tokenizing Real-World Assets (RWAs) using ERC-1155 standard.
 *         Supports fractional ownership, metadata storage via IPFS, and ERC-2981 royalties.
 * @dev This contract enables:
 *      - Tokenization of real-world assets into ERC-1155 tokens
 *      - Fractional ownership through multi-amount minting
 *      - IPFS-based metadata storage
 *      - NFT royalties via ERC-2981 standard
 *      - Clone pattern support via initialize() function
 */
contract RWATokenizer is ERC1155, Ownable, IERC2981 {
    /**
     * @notice Royalty information structure
     * @member recipient Address receiving royalties
     * @member royaltyFraction Royalty amount in basis points (e.g., 250 = 2.5%)
     */
    struct RoyaltyInfo {
        address recipient;
        uint96 royaltyFraction;
    }

    /// @notice Flag to track if contract has been initialized (for clones)
    bool public initialized;

    /**
     * @notice Initializer for factory-deployed clones
     * @dev Can only be called once, mimics constructor for proxy pattern
     * @param baseURI Base URI for token metadata (typically IPFS gateway)
     * @param initialOwner Initial owner of the contract
     */
    function initialize(string memory baseURI, address initialOwner) public {
        require(!initialized, "Already initialized");
        initialized = true;
        _setURI(baseURI);
        _transferOwnership(initialOwner);
        _defaultRoyaltyRecipient = initialOwner;
    }

    /**
     * @notice Fallback constructor for direct deployments
     * @dev Skips initialization when called directly
     */
    constructor(string memory baseURI, address initialOwner) ERC1155(baseURI) Ownable(initialOwner) {
        initialized = true;
        _defaultRoyaltyRecipient = initialOwner;
    }

    /**
     * @notice Error thrown when unauthorized access is attempted
     * @param caller Address that attempted the unauthorized action
     */
    error UnauthorizedAccess(address caller);

    /**
     * @notice Maps token IDs to their IPFS metadata URIs
     */
    mapping(uint256 => string) private _tokenURIs;

    // Royalty info: token ID => (recipient, royalty percentage in basis points)
    mapping(uint256 => RoyaltyInfo) private _royaltyInfo;
    
    // Default royalty recipient (contract owner)
    address private _defaultRoyaltyRecipient;
    uint96 private _defaultRoyaltyBasisPoints = 250; // 2.5% default

    // Event emitted when a new token is minted
    event TokenMinted(address indexed to, uint256 indexed tokenId, uint256 amount, string metadataURI);

    /**
     * @dev Constructor to initialize the base URI for the contract.
     * @param baseURI The base URI for metadata.
     */


    /**
     * @dev Mint a new token representing a Real-World Asset (RWA).
     * @param to The address to receive the minted tokens.
     * @param tokenId The unique ID of the token.
     * @param amount The amount of tokens to mint (for fractional ownership).
     * @param metadataURI The IPFS URI containing metadata for the token.
     */
    function mintRWA(
        address to,
        uint256 tokenId,
        uint256 amount,
        string memory metadataURI
    ) external {
        if (msg.sender != owner()) {
            revert UnauthorizedAccess(msg.sender);
        }
        require(bytes(metadataURI).length > 0, "RWATokenizer: Metadata URI is required");
        require(bytes(_tokenURIs[tokenId]).length == 0, "RWATokenizer: Token ID already exists");
        if (msg.sender != owner()) {
            revert UnauthorizedAccess(msg.sender);
        }

        _mint(to, tokenId, amount, "");
        _setTokenURI(tokenId, metadataURI);

        emit TokenMinted(to, tokenId, amount, metadataURI);
    }

    /**
     * @dev Get the metadata URI for a specific token ID.
     * @param tokenId The ID of the token.
     * @return The metadata URI associated with the token.
     */


    /**
     * @dev Internal function to set the metadata URI for a token ID.
     * @param tokenId The ID of the token.
     * @param metadataURI The IPFS URI to associate with the token.
     */



    /**
     * @dev Get the metadata URI for a specific token ID.
     * @param tokenId The ID of the token.
     * @return The metadata URI associated with the token.
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(bytes(_tokenURIs[tokenId]).length > 0, "RWATokenizer: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Internal function to set the metadata URI for a token ID.
     * @param tokenId The ID of the token.
     * @param metadataURI The IPFS URI to associate with the token.
     */
    function _setTokenURI(uint256 tokenId, string memory metadataURI) internal {
        _tokenURIs[tokenId] = metadataURI;
    }

    /**
     * @dev Set royalty information for a specific token.
     * @param tokenId The ID of the token.
     * @param recipient The address that should receive royalties.
     * @param royaltyBasisPoints The royalty amount in basis points (e.g., 250 = 2.5%).
     */
    function setTokenRoyalty(
        uint256 tokenId,
        address recipient,
        uint96 royaltyBasisPoints
    ) external onlyOwner {
        require(royaltyBasisPoints <= 10000, "RWATokenizer: royalty exceeds max");
        _royaltyInfo[tokenId] = RoyaltyInfo(recipient, royaltyBasisPoints);
    }

    /**
     * @dev Set default royalty for all tokens without specific royalty set.
     * @param recipient The address that should receive royalties.
     * @param royaltyBasisPoints The default royalty amount in basis points.
     */
    function setDefaultRoyalty(address recipient, uint96 royaltyBasisPoints) external onlyOwner {
        require(royaltyBasisPoints <= 10000, "RWATokenizer: royalty exceeds max");
        _defaultRoyaltyRecipient = recipient;
        _defaultRoyaltyBasisPoints = royaltyBasisPoints;
    }

    /**
     * @dev See {IERC2981-royaltyInfo}.
     */
    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view override returns (address, uint256) {
        RoyaltyInfo memory royalty = _royaltyInfo[tokenId];
        if (royalty.recipient == address(0)) {
            royalty.recipient = _defaultRoyaltyRecipient == address(0) ? owner() : _defaultRoyaltyRecipient;
            royalty.royaltyFraction = _defaultRoyaltyBasisPoints;
        }
        uint256 royaltyAmount = (salePrice * royalty.royaltyFraction) / 10000;
        return (royalty.recipient, royaltyAmount);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, IERC165) returns (bool) {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }
}
