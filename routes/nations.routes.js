const { Router } = require("express");
const { STATUS } = require("../core/constants");

const router = Router();
const { readFile } = require("../core/fs");

const getNationsData = async () => {
    const data = await readFile("nations.json");
    return data;
};

router.get("/", async (req, res) => {
    try {
        const nations = await getNationsData();
        res.status(STATUS.SUCCESSFUL).send(nations);
    } catch (error) {
        res.status(STATUS.CLIENT_ERROR).send({ message: error.message || "Something went wrong. Try again." });
    }
})

module.exports = router;