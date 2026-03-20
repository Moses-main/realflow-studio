// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/RWATokenizer.sol";

contract RWATokenizerTest is Test {
    RWATokenizer private rwaTokenizer;
    address private owner;
    address private user;

    function setUp() public {
        owner = address(this);
        user = address(0x123);
        rwaTokenizer = new RWATokenizer("", owner);
    }

    function testMintRWA() public {
        uint256 tokenId = 1;
        uint256 amount = 100;
        string memory metadataURI = "ipfs://example-metadata-uri";

        rwaTokenizer.mintRWA(user, tokenId, amount, metadataURI);

        assertEq(rwaTokenizer.balanceOf(user, tokenId), amount);
        assertEq(rwaTokenizer.uri(tokenId), metadataURI);
    }

    function testMintRWA_RevertIfNotOwner() public {
        uint256 tokenId = 1;
        uint256 amount = 100;
        string memory metadataURI = "ipfs://example-metadata-uri";

        vm.prank(user);
        vm.expectRevert(abi.encodeWithSelector(RWATokenizer.UnauthorizedAccess.selector, user));
        rwaTokenizer.mintRWA(user, tokenId, amount, metadataURI);
    }

    function testMintRWA_RevertIfTokenExists() public {
        uint256 tokenId = 1;
        uint256 amount = 100;
        string memory metadataURI = "ipfs://example-metadata-uri";

        rwaTokenizer.mintRWA(user, tokenId, amount, metadataURI);

        vm.expectRevert("RWATokenizer: Token ID already exists");
        rwaTokenizer.mintRWA(user, tokenId, amount, metadataURI);
    }

    function testUri() public {
        uint256 tokenId = 1;
        uint256 amount = 100;
        string memory metadataURI = "ipfs://example-metadata-uri";

        rwaTokenizer.mintRWA(user, tokenId, amount, metadataURI);

        assertEq(rwaTokenizer.uri(tokenId), metadataURI);
    }

    function testUri_RevertIfNonexistentToken() public {
        uint256 tokenId = 999;

        vm.expectRevert("RWATokenizer: URI query for nonexistent token");
        rwaTokenizer.uri(tokenId);
    }
}
