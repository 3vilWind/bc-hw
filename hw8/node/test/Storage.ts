import {loadFixture} from "@nomicfoundation/hardhat-network-helpers"
import {expect} from "chai"
import {ethers} from "hardhat"

describe("Storage", function () {
    const DATA1 = '0x' + '41'.repeat(32)
    const DATA2 = '0x' + '42'.repeat(32)

    async function deployOneYearLockFixture() {
        const Storage = await ethers.getContractFactory("Storage")
        const storage = await Storage.deploy()
        await storage.deployed()

        return storage
    }

    it("Put & get", async function () {
        const storage = await loadFixture(deployOneYearLockFixture)
        const [owner, otherAccount] = await ethers.getSigners()
        await storage
            .connect(owner)
            .put(DATA1)

        await expect(await storage.data(owner.address)).equal(DATA1)
    })

    it("Two puts & gets", async function () {
        const storage = await loadFixture(deployOneYearLockFixture)
        const [owner, otherAccount] = await ethers.getSigners()
        await storage
            .connect(owner)
            .put(DATA1)
        await storage
            .connect(otherAccount)
            .put(DATA2)

        await expect(await storage.data(owner.address)).equal(DATA1)
        await expect(await storage.data(otherAccount.address)).equal(DATA2)
    })

    it("Rewrite", async function () {
        const storage = await loadFixture(deployOneYearLockFixture)
        const [owner, otherAccount] = await ethers.getSigners()
        await storage
            .connect(owner)
            .put(DATA1)

        await expect(await storage.data(owner.address)).equal(DATA1)

        await storage
            .connect(owner)
            .put(DATA2)

        await expect(await storage.data(owner.address)).equal(DATA2)
    })
})
