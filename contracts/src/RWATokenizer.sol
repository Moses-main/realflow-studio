// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC1155 } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RWATokenizer
 * @author RealFlow Studio
 * @notice A contract for tokenizing Real-World Assets (RWAs) using ERC-1155 standard.
 * @dev Supports fractional ownership and metadata storage via IPFS.
 *      Only the contract owner can mint new tokens.
 */
contract RWATokenizer is ERC1155, Ownable {
    /// @notice Emitted when unauthorized access is attempted
    /// @param caller The address that attempted unauthorized access
    error UnauthorizedAccess(address caller);

    /// @notice Mapping to store metadata URIs for each token ID
    /// @dev Token ID => IPFS URI containing asset metadata
    mapping(uint256 => string) private _tokenURIs;

    /// @notice Emitted when a new token is minted
    /// @param to The address receiving the minted tokens
    /// @param tokenId The unique ID of the minted token
    /// @param amount The amount of tokens minted (for fractional ownership)
    /// @param metadataURI The IPFS URI containing metadata for the token
    event TokenMinted(address indexed to, uint256 indexed tokenId, uint256 amount, string metadataURI);

    /// @notice Emitted when tokens are batch minted
    /// @param to The address receiving all minted tokens
    /// @param tokenIds Array of token IDs minted
    /// @param amounts Array of amounts for each token
    event BatchMinted(address indexed to, uint256[] tokenIds, uint256[] amounts);

    /**
     * @notice Initializes the RWATokenizer contract
     * @dev Sets the base URI for token metadata and the initial owner
     * @param baseURI The base URI for metadata (e.g., "https://api.realflow.io/metadata/")
     * @param initialOwner The address that will own the contract and have minting rights
     */
    constructor(string memory baseURI, address initialOwner) ERC1155(baseURI) Ownable(initialOwner) {}

    /**
     * @notice Mint a new token representing a Real-World Asset (RWA)
     * @dev Only the contract owner can call this function. Reverts if:
     *      - Caller is not the owner
     *      - Amount is zero
     *      - Metadata URI is empty
     *      - Token ID already exists
     * @param to The address to receive the minted tokens
     * @param tokenId The unique ID of the token (must not exist)
     * @param amount The amount of tokens to mint (for fractional ownership)
     * @param metadataURI The IPFS URI containing metadata for the token
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
        require(amount > 0, "RWATokenizer: Amount must be greater than zero");
        require(bytes(metadataURI).length > 0, "RWATokenizer: Metadata URI is required");
        require(bytes(_tokenURIs[tokenId]).length == 0, "RWATokenizer: Token ID already exists");

        _mint(to, tokenId, amount, "");
        _setTokenURI(tokenId, metadataURI);

        emit TokenMinted(to, tokenId, amount, metadataURI);
    }

    /**
     * @notice Batch mint multiple RWA tokens in a single transaction for gas efficiency
     * @dev Only the contract owner can call this function. Gas optimized with unchecked increment.
     *      Maximum batch size is 50 tokens to prevent block gas limit issues.
     * @param to The address to receive all minted tokens
     * @param tokenIds Array of unique token IDs (must not exist)
     * @param amounts Array of amounts for each token (must match tokenIds length, each > 0)
     * @param metadataURIs Array of IPFS URIs for each token (must match tokenIds length)
     */
    function mintRWA_Batch(
        address to,
        uint256[] calldata tokenIds,
        uint256[] calldata amounts,
        string[] calldata metadataURIs
    ) external {
        if (msg.sender != owner()) {
            revert UnauthorizedAccess(msg.sender);
        }
        
        uint256 length = tokenIds.length;
        require(length == amounts.length && length == metadataURIs.length, "RWATokenizer: Array length mismatch");
        require(length > 0 && length <= 50, "RWATokenizer: Batch size must be 1-50");

        for (uint256 i = 0; i < length;) {
            uint256 tokenId = tokenIds[i];
            uint256 amount = amounts[i];
            string memory metadataURI = metadataURIs[i];

            require(amount > 0, "RWATokenizer: Amount must be greater than zero");
            require(bytes(metadataURI).length > 0, "RWATokenizer: Metadata URI is required");
            require(bytes(_tokenURIs[tokenId]).length == 0, "RWATokenizer: Token ID already exists");

            _mint(to, tokenId, amount, "");
            _setTokenURI(tokenId, metadataURI);

            emit TokenMinted(to, tokenId, amount, metadataURI);

            unchecked {
                ++i;
            }
        }

        emit BatchMinted(to, tokenIds, amounts);
    }

    /**
     * @notice Get the metadata URI for a specific token ID
     * @dev Reverts if the token does not exist
     * @param tokenId The ID of the token
     * @return The metadata URI associated with the token
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(bytes(_tokenURIs[tokenId]).length > 0, "RWATokenizer: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    /**
     * @notice Set the metadata URI for a token ID (internal)
     * @dev Called during minting to store the token's metadata URI
     * @param tokenId The ID of the token
     * @param metadataURI The IPFS URI to associate with the token
     */
    function _setTokenURI(uint256 tokenId, string memory metadataURI) internal {
        _tokenURIs[tokenId] = metadataURI;
    }
}
