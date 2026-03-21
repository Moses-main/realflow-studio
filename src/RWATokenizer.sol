// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";


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
        if (initialized) revert AlreadyInitialized();
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
     * @notice Error thrown when address is blacklisted
     * @param account Blacklisted address
     */
    error Blacklisted(address account);

    /**
     * @notice Error thrown when address is not whitelisted
     * @param account Address not in whitelist
     */
    error NotWhitelisted(address account);

    /**
     * @notice Error thrown when already initialized
     */
    error AlreadyInitialized();

    /**
     * @notice Error thrown when token does not exist
     * @param tokenId Token ID that doesn't exist
     */
    error TokenDoesNotExist(uint256 tokenId);

    /**
     * @notice Error thrown when royalty exceeds maximum
     * @param royaltyBasisPoints Provided royalty value
     */
    error RoyaltyExceedsMax(uint96 royaltyBasisPoints);

    /**
     * @notice Error thrown when permit has expired
     * @param deadline Expiration timestamp
     */
    error PermitExpired(uint256 deadline);

    /**
     * @notice Error thrown when signature is invalid
     */
    error InvalidSignature();

    /**
     * @notice Error thrown when address is zero
     */
    error ZeroAddress();

    /**
     * @notice Error thrown when metadata URI is empty
     */
    error EmptyMetadataURI();

    /**
     * @notice Error thrown when token ID already exists
     * @param tokenId Existing token ID
     */
    error TokenAlreadyExists(uint256 tokenId);

    /**
     * @notice Error thrown when supply cap exceeded
     * @param tokenId Token ID
     * @param currentSupply Current supply
     * @param cap Maximum supply cap
     */
    error SupplyCapExceeded(uint256 tokenId, uint256 currentSupply, uint256 cap);

    /**
     * @notice Error thrown when invalid cap value
     */
    error InvalidCap();

    // Supply cap mappings
    mapping(uint256 => uint256) private _tokenSupply;
    mapping(uint256 => uint256) private _tokenCap;
    bool private _useDefaultCap;
    uint256 private _defaultCap;

    // Event for supply cap changes
    event SupplyCapUpdated(uint256 indexed tokenId, uint256 oldCap, uint256 newCap);
    event DefaultSupplyCapUpdated(uint256 oldCap, uint256 newCap);

    // Access control lists
    mapping(address => bool) private _whitelist;
    mapping(address => bool) private _blacklist;
    bool private _whitelistEnabled;
    bool private _blacklistEnabled;

    // Events for access control changes
    event AddressWhitelisted(address indexed account, bool status);
    event AddressBlacklisted(address indexed account, bool status);
    event WhitelistEnabled(bool enabled);
    event BlacklistEnabled(bool enabled);

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

    // Event emitted when tokens are transferred
    event TokenTransferred(address indexed from, address indexed to, uint256 indexed tokenId, uint256 amount);

    // Event emitted when token URI is set
    event TokenURISet(uint256 indexed tokenId, string metadataURI);

    // Event emitted when token royalty is set
    event TokenRoyaltySet(uint256 indexed tokenId, address indexed recipient, uint96 royaltyBasisPoints);

    // Event emitted when default royalty is set
    event DefaultRoyaltySet(address indexed recipient, uint96 royaltyBasisPoints);

    // Event emitted when implementation is updated
    event ImplementationUpdated(address indexed oldImpl, address indexed newImpl);

    // Event emitted when deployment fee is updated
    event DeploymentFeeUpdated(uint256 oldFee, uint256 newFee);

    /**
     * @dev Constructor to initialize the base URI for the contract.
     * @param baseURI The base URI for metadata.
     */


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
        if (bytes(_tokenURIs[tokenId]).length == 0) revert TokenDoesNotExist(tokenId);
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Internal function to set the metadata URI for a token ID.
     * @param tokenId The ID of the token.
     * @param metadataURI The IPFS URI to associate with the token.
     */
    function _setTokenURI(uint256 tokenId, string memory metadataURI) internal {
        _tokenURIs[tokenId] = metadataURI;
        emit TokenURISet(tokenId, metadataURI);
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
        if (royaltyBasisPoints > 10000) revert RoyaltyExceedsMax(royaltyBasisPoints);
        _royaltyInfo[tokenId] = RoyaltyInfo(recipient, royaltyBasisPoints);
        emit TokenRoyaltySet(tokenId, recipient, royaltyBasisPoints);
    }

    /**
     * @dev Set default royalty for all tokens without specific royalty set.
     * @param recipient The address that should receive royalties.
     * @param royaltyBasisPoints The default royalty amount in basis points.
     */
    function setDefaultRoyalty(address recipient, uint96 royaltyBasisPoints) external onlyOwner {
        if (royaltyBasisPoints > 10000) revert RoyaltyExceedsMax(royaltyBasisPoints);
        _defaultRoyaltyRecipient = recipient;
        _defaultRoyaltyBasisPoints = royaltyBasisPoints;
        emit DefaultRoyaltySet(recipient, royaltyBasisPoints);
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

    // EIP-2612 style permit for operator approvals
    bytes32 private constant PERMIT_TYPEHASH = keccak256(
        "Permit(address owner,address operator,uint256 nonce,uint256 deadline)"
    );

    mapping(address => uint256) private _nonces;

    /**
     * @notice Permit an operator using a signature (gasless approval)
     * @param owner Address of the token owner
     * @param operator Address to approve as operator
     * @param deadline Expiration timestamp for the signature
     * @param v Recovery byte
     * @param r First part of signature
     * @param s Second part of signature
     */
    function permit(
        address owner,
        address operator,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        if (block.timestamp > deadline) revert PermitExpired(deadline);
        
        bytes32 structHash = keccak256(
            abi.encode(PERMIT_TYPEHASH, owner, operator, _nonces[owner]++, deadline)
        );
        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(hash, v, r, s);
        
        if (signer != owner) revert InvalidSignature();
        
        _setApprovalForAll(owner, operator, true);
    }

    /**
     * @notice Get the current nonce for an owner
     * @param owner Address to check
     * @return Current nonce
     */
    function nonces(address owner) external view returns (uint256) {
        return _nonces[owner];
    }

    /**
     * @dev Hash typed data according to EIP-712
     */
    function _hashTypedDataV4(bytes32 structHash) internal view returns (bytes32) {
        return keccak256(
            abi.encodePacked("\x19\x01", _domainSeparator(), structHash)
        );
    }

    /**
     * @dev EIP-712 domain separator
     */
    function _domainSeparator() internal view returns (bytes32) {
        return keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("RealFlow RWATokenizer")),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }

    // ============ Whitelist/Blacklist Functions ============

    /**
     * @notice Add or remove address from whitelist
     * @param account Address to whitelist/unwhitelist
     * @param status true to whitelist, false to remove
     */
    function setWhitelist(address account, bool status) external onlyOwner {
        if (account == address(0)) revert ZeroAddress();
        _whitelist[account] = status;
        emit AddressWhitelisted(account, status);
    }

    /**
     * @notice Add or remove address from blacklist
     * @param account Address to blacklist/unblacklist
     * @param status true to blacklist, false to remove
     */
    function setBlacklist(address account, bool status) external onlyOwner {
        if (account == address(0)) revert ZeroAddress();
        _blacklist[account] = status;
        emit AddressBlacklisted(account, status);
    }

    /**
     * @notice Batch whitelist multiple addresses
     * @param accounts Array of addresses to whitelist
     * @param status Whitelist status
     */
    function batchWhitelist(address[] calldata accounts, bool status) external onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            if (accounts[i] != address(0)) {
                _whitelist[accounts[i]] = status;
                emit AddressWhitelisted(accounts[i], status);
            }
        }
    }

    /**
     * @notice Batch blacklist multiple addresses
     * @param accounts Array of addresses to blacklist
     * @param status Blacklist status
     */
    function batchBlacklist(address[] calldata accounts, bool status) external onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            if (accounts[i] != address(0)) {
                _blacklist[accounts[i]] = status;
                emit AddressBlacklisted(accounts[i], status);
            }
        }
    }

    /**
     * @notice Enable or disable whitelist requirement
     * @param enabled true to require whitelist
     */
    function setWhitelistEnabled(bool enabled) external onlyOwner {
        _whitelistEnabled = enabled;
        emit WhitelistEnabled(enabled);
    }

    /**
     * @notice Enable or disable blacklist
     * @param enabled true to enable blacklist
     */
    function setBlacklistEnabled(bool enabled) external onlyOwner {
        _blacklistEnabled = enabled;
        emit BlacklistEnabled(enabled);
    }

    /**
     * @notice Check if address is whitelisted
     * @param account Address to check
     * @return true if whitelisted
     */
    function isWhitelisted(address account) external view returns (bool) {
        return _whitelist[account];
    }

    /**
     * @notice Check if address is blacklisted
     * @param account Address to check
     * @return true if blacklisted
     */
    function isBlacklisted(address account) external view returns (bool) {
        return _blacklist[account];
    }

    /**
     * @notice Check if whitelist is enabled
     * @return true if enabled
     */
    function whitelistEnabled() external view returns (bool) {
        return _whitelistEnabled;
    }

    /**
     * @notice Check if blacklist is enabled
     * @return true if enabled
     */
    function blacklistEnabled() external view returns (bool) {
        return _blacklistEnabled;
    }

    /**
     * @dev Modifier to check blacklist/whitelist
     */
    modifier notBlacklisted(address account) {
        if (_blacklistEnabled && _blacklist[account]) {
            revert Blacklisted(account);
        }
        _;
    }

    /**
     * @dev Modifier to check whitelist
     */
    modifier onlyWhitelisted(address account) {
        if (_whitelistEnabled && !_whitelist[account]) {
            revert NotWhitelisted(account);
        }
        _;
    }

    /**
     * @dev Override mint to check access lists and supply cap
     */
    function mintRWA(
        address to,
        uint256 tokenId,
        uint256 amount,
        string memory metadataURI
    ) external onlyWhitelisted(to) notBlacklisted(to) {
        if (msg.sender != owner()) {
            revert UnauthorizedAccess(msg.sender);
        }
        if (bytes(metadataURI).length == 0) revert EmptyMetadataURI();
        if (bytes(_tokenURIs[tokenId]).length != 0) revert TokenAlreadyExists(tokenId);

        // Check supply cap
        uint256 cap = _getTokenCap(tokenId);
        if (cap > 0 && _tokenSupply[tokenId] + amount > cap) {
            revert SupplyCapExceeded(tokenId, _tokenSupply[tokenId], cap);
        }

        _mint(to, tokenId, amount, "");
        _tokenSupply[tokenId] += amount;
        _setTokenURI(tokenId, metadataURI);

        emit TokenMinted(to, tokenId, amount, metadataURI);
    }

    /**
     * @notice Set supply cap for a specific token
     * @param tokenId Token ID
     * @param cap Maximum supply (0 for unlimited)
     */
    function setTokenCap(uint256 tokenId, uint256 cap) external onlyOwner {
        uint256 oldCap = _tokenCap[tokenId];
        _tokenCap[tokenId] = cap;
        emit SupplyCapUpdated(tokenId, oldCap, cap);
    }

    /**
     * @notice Set default supply cap for all tokens
     * @param cap Default maximum supply (0 for unlimited)
     */
    function setDefaultSupplyCap(uint256 cap) external onlyOwner {
        uint256 oldCap = _defaultCap;
        _defaultCap = cap;
        _useDefaultCap = true;
        emit DefaultSupplyCapUpdated(oldCap, cap);
    }

    /**
     * @notice Get supply cap for a token
     * @param tokenId Token ID
     * @return Cap for the token (0 if unlimited)
     */
    function getTokenCap(uint256 tokenId) external view returns (uint256) {
        return _getTokenCap(tokenId);
    }

    /**
     * @notice Get current supply for a token
     * @param tokenId Token ID
     * @return Current supply
     */
    function getTokenSupply(uint256 tokenId) external view returns (uint256) {
        return _tokenSupply[tokenId];
    }

    /**
     * @dev Internal function to get token cap
     */
    function _getTokenCap(uint256 tokenId) internal view returns (uint256) {
        uint256 cap = _tokenCap[tokenId];
        if (cap == 0 && _useDefaultCap) {
            return _defaultCap;
        }
        return cap;
    }

    /**
     * @dev Hook called after any token transfer (including mint and burn)
     * @param from Source address (address(0) for mint)
     * @param to Destination address (address(0) for burn)
     * @param tokenId Token ID transferred
     * @param amount Amount transferred
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount
    ) internal virtual {
        // Emit custom transfer event (skip for mint - already has TokenMinted)
        if (from != address(0) && to != address(0)) {
            emit TokenTransferred(from, to, tokenId, amount);
        }
    }
}
