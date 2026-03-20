pragma solidity ^0.8.20;

import { ERC1155 } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";


/**
 * @title RWATokenizer
 * @dev A contract for tokenizing Real-World Assets (RWAs) using ERC-1155 standard.
 *      Supports fractional ownership and metadata storage via IPFS.
 */
contract RWATokenizer is ERC1155, Ownable {
    constructor(string memory baseURI, address initialOwner) ERC1155(baseURI) Ownable(initialOwner) {}



    error UnauthorizedAccess(address caller);


    // Mapping to store metadata URIs for each token ID
    mapping(uint256 => string) private _tokenURIs;

    // Event emitted when a new token is minted
    event TokenMinted(address indexed to, uint256 indexed tokenId, uint256 amount, string metadataURI);

    // Event emitted when tokens are batch minted
    event BatchMinted(address indexed to, uint256[] tokenIds, uint256[] amounts);

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
        require(amount > 0, "RWATokenizer: Amount must be greater than zero");
        require(bytes(metadataURI).length > 0, "RWATokenizer: Metadata URI is required");
        require(bytes(_tokenURIs[tokenId]).length == 0, "RWATokenizer: Token ID already exists");

        _mint(to, tokenId, amount, "");
        _setTokenURI(tokenId, metadataURI);

        emit TokenMinted(to, tokenId, amount, metadataURI);
    }

    /**
     * @dev Batch mint multiple RWA tokens in a single transaction for gas efficiency.
     * @param to The address to receive all minted tokens.
     * @param tokenIds Array of unique token IDs.
     * @param amounts Array of amounts for each token (must match tokenIds length).
     * @param metadataURIs Array of IPFS URIs for each token (must match tokenIds length).
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
        require(amount > 0, "RWATokenizer: Amount must be greater than zero");
        require(bytes(metadataURI).length > 0, "RWATokenizer: Metadata URI is required");
        require(bytes(_tokenURIs[tokenId]).length == 0, "RWATokenizer: Token ID already exists");

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
}
