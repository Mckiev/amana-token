import { ethers } from 'hardhat';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { AmanaToken } from '../typechain-types';
import { ContractRunner } from 'ethers';

chai.use(chaiAsPromised);
const { assert } = chai;

type Signer = ContractRunner & {
  address: string;
};

describe('AmanaToken', function () {
  let amanaToken: AmanaToken;
  let owner: Signer;
  let alice: Signer;
  let bob: Signer;

  beforeEach(async () => {
     const AmanaTokenContract = await ethers.getContractFactory('AmanaToken');
     amanaToken = await AmanaTokenContract.deploy();
     [owner, alice, bob] = await ethers.getSigners();
  });

  describe('Ownership', function () {
    it('Should set the right owner', async function () {
      assert.strictEqual(await amanaToken.owner(), owner.address);
    });
  });

  describe('Minting', function () {
    it('Should mint tokens correctly to the owner', async function () {
      await amanaToken.mint(owner.address, 100n);
      assert.strictEqual(await amanaToken.balanceOf(owner.address), 100n);
    });

    it('Should mint tokens correctly to another user', async function () {
      await amanaToken.mint(alice.address, 100n);
      assert.strictEqual(await amanaToken.balanceOf(alice.address), 100n);
    });

    it('Should fail if a non-owner tries to mint tokens', async function () {
      await assert.isRejected(amanaToken.connect(alice).mint(alice.address, 100));
    });
  });

  describe('Burning', function () {
    it('Should burn tokens correctly', async function () {
      await amanaToken.mint(owner.address, 100);
      await amanaToken.burn(50);
      assert.strictEqual(await amanaToken.balanceOf(owner.address), 50n);
    });

    it('Should fail to burn if the user does not have enough tokens', async function () {
      await amanaToken.mint(owner.address, 100);
      await assert.isRejected(amanaToken.burn(200n));
    });
  });

  describe('Pausing', function () {
    it('Should pause minting', async function () {
      await amanaToken.pause();
      await assert.isRejected(amanaToken.mint(owner.address, 100n));
      await amanaToken.unpause();
      await amanaToken.mint(owner.address, 100n);
      assert.strictEqual(await amanaToken.balanceOf(owner.address), 100n);
    });

    it('Should pause sending tokens', async function () {
      await amanaToken.mint(alice.address, 100n);
      await amanaToken.pause();
      await assert.isRejected(amanaToken.connect(alice).transfer(bob.address, 25n));
      await amanaToken.unpause();
      await amanaToken.connect(alice).transfer(bob.address, 25n);
      assert.strictEqual(await amanaToken.balanceOf(alice.address), 75n);
      assert.strictEqual(await amanaToken.balanceOf(bob.address), 25n);
    });

    it('Should fail if a non-owner tries to pause or unpause the contract', async function () {
      await assert.isRejected(amanaToken.connect(alice).pause());
      await assert.isRejected(amanaToken.connect(alice).unpause());
    });
  });
});
