realflow-studio/test/RWATokenizer.test.js
```
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RWATokenizer", function () {
  let RWATokenizer, rwaTokenizer, owner, addr1, addr2;

  beforeEach(async function () {
    // Deploy the contract
    RWATokenizer = await ethers.getContractFactory("RWATokenizer");
    [owner, addr1, addr2] = await ethers.getSigners();
    rwaTokenizer = await RWATokenizer.deploy("");
    await rwaTokenizer.deployed();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await rwaTokenizer.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should mint a new token and set the correct metadata URI", async function () {
      const tokenId = 1;
      const amount = 10;
      const metadataURI = "ipfs://example-metadata-uri";

      await rwaTokenizer.mintRWA(addr1.address, tokenId, amount, metadataURI);

      expect(await rwaTokenizer.balanceOf(addr1.address, tokenId)).to.equal(amount);
      expect(await rwaTokenizer.uri(tokenId)).to.equal(metadataURI);
    });

    it("Should emit a TokenMinted event on minting", async function () {
      const tokenId = 1;
      const amount = 10;
      const metadataURI = "ipfs://example-metadata-uri";

      await expect(rwaTokenizer.mintRWA(addr1.address, tokenId, amount, metadataURI))
        .to.emit(rwaTokenizer, "TokenMinted")
        .withArgs(addr1.address, tokenId, amount, metadataURI);
    });

    it("Should revert if the metadata URI is empty", async function () {
      const tokenId = 1;
      const amount = 10;

      await expect(
        rwaTokenizer.mintRWA(addr1.address, tokenId, amount, "")
      ).to.be.revertedWith("RWATokenizer: Metadata URI is required");
    });

    it("Should revert if the token ID already exists", async function () {
      const tokenId = 1;
      const amount = 10;
      const metadataURI = "ipfs://example-metadata-uri";

      await rwaTokenizer.mintRWA(addr1.address, tokenId, amount, metadataURI);

      await expect(
        rwaTokenizer.mintRWA(addr1.address, tokenId, amount, metadataURI)
      ).to.be.revertedWith("RWATokenizer: Token ID already exists");
    });
  });

  describe("Metadata URI", function () {
    it("Should return the correct metadata URI for a token ID", async function () {
      const tokenId = 1;
      const amount = 10;
      const metadataURI = "ipfs://example-metadata-uri";

      await rwaTokenizer.mintRWA(addr1.address, tokenId, amount, metadataURI);

      expect(await rwaTokenizer.uri(tokenId)).to.equal(metadataURI);
    });

    it("Should revert if querying URI for a non-existent token ID", async function () {
      const tokenId = 999;

      await expect(rwaTokenizer.uri(tokenId)).to.be.revertedWith(
        "ERC1155Metadata: URI query for nonexistent token"
      );
    });
  });
});
