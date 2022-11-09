import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

const initialSupply = 230000000; // Twitter users

describe("TrumpBackTwitter", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const TrumpBackTwitter = await ethers.getContractFactory("TrumpBackTwitter");
    const trumpBackTwitter = await TrumpBackTwitter.deploy(initialSupply);

    return { trumpBackTwitter, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right initialSupply", async function () {
      const { trumpBackTwitter } = await loadFixture(deploy);

      const total = await trumpBackTwitter.totalSupply();
      console.log(total);
      expect(total).to.equal(initialSupply);
    });

    it("Should set the right owner", async function () {
      const { trumpBackTwitter, owner } = await loadFixture(deploy);

      expect(await trumpBackTwitter.owner()).to.equal(owner.address);
    });

    it("Should receive and store the funds to trumpBackTwitter", async function () {
      const { trumpBackTwitter } = await loadFixture(
        deploy
      );

      expect(await ethers.provider.getBalance(trumpBackTwitter.address)).to.equal(
        lockedAmount
      );
    });

    it("Should fail if the unlockTime is not in the future", async function () {
      // We don't use the fixture here because we want a different deployment
      const latestTime = await time.latest();
      const TrumpBackTwitter = await ethers.getContractFactory("TrumpBackTwitter");
      await expect(TrumpBackTwitter.deploy(latestTime, { value: 1 })).to.be.revertedWith(
        "Unlock time should be in the future"
      );
    });
  });

  describe("Withdrawals", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called too soon", async function () {
        const { trumpBackTwitter } = await loadFixture(deploy);

        await expect(trumpBackTwitter.withdraw()).to.be.revertedWith(
          "You can't withdraw yet"
        );
      });

      it("Should revert with the right error if called from another account", async function () {
        const { trumpBackTwitter, otherAccount } = await loadFixture(
          deploy
        );

        // We use trumpBackTwitter.connect() to send a transaction from another account
        await expect(trumpBackTwitter.connect(otherAccount).withdraw()).to.be.revertedWith(
          "You aren't the owner"
        );
      });

      it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
        const { trumpBackTwitter, unlockTime } = await loadFixture(
          deploy
        );

        // Transactions are sent using the first signer by default
        await time.increaseTo(unlockTime);

        await expect(trumpBackTwitter.withdraw()).not.to.be.reverted;
      });
    });

    describe("Events", function () {
      it("Should emit an event on withdrawals", async function () {
        const { trumpBackTwitter, unlockTime, lockedAmount } = await loadFixture(
          deploy
        );

        await time.increaseTo(unlockTime);

        await expect(trumpBackTwitter.withdraw())
          .to.emit(trumpBackTwitter, "Withdrawal")
          .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
      });
    });

    describe("Transfers", function () {
      it("Should transfer the funds to the owner", async function () {
        const { trumpBackTwitter, unlockTime, lockedAmount, owner } = await loadFixture(
          deploy
        );

        await time.increaseTo(unlockTime);

        await expect(trumpBackTwitter.withdraw()).to.changeEtherBalances(
          [owner, trumpBackTwitter],
          [lockedAmount, -lockedAmount]
        );
      });
    });
  });
});
