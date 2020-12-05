const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { readFile } = require("./core/fs");

const { MONGO_URL, PORT } = require("./core/constants");

const INIT_COUNTER = 3;
const MAX_COUNTER = 4;
const MIN_COUNTER = 1;

app.use(express.json({ extended: true }));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/nations", require("./routes/nations.routes"));

if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.join(__dirname, "client", "build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

async function start() {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });

        server.listen(PORT, () => {
            console.log("Server listening at port %d", PORT);
        });

        const clients = [];
        let bannedNations = [];
        let currentCounter = INIT_COUNTER;
        let selectedNations = [];

        io.on("connection", socket => {
            console.log("connection", socket.id);

            socket.on("joinClient", async data => {
                const newUser = { name: data.userName, id: socket.id, status: false };
                if (!clients.find(({ name }) => name === data.userName)) {
                    clients.push(newUser);
                }

                io.emit("joinServer", { clients });
                io.emit("banNationsServer", { bannedNations });
                io.emit("updateCounterServer", { currentCounter });
            });

            socket.on("updateCounterClient", async value => {
                // eslint-disable-next-line no-nested-ternary
                currentCounter = value <= MAX_COUNTER ? (value >= MIN_COUNTER ? value : MIN_COUNTER) : MAX_COUNTER;
                io.emit("updateCounterServer", { currentCounter });
            });

            socket.on("leaveClient", async () => {
                const idx = clients.findIndex(el => el.id === socket.id);
                clients.splice(idx, 1);
                socket.broadcast.emit("leaveServer", { clients });

                const clearedBans = bannedNations.filter(el => el.socketId !== socket.id);
                bannedNations = clearedBans;
                socket.broadcast.emit("banNationsServer", { bannedNations });
            });

            socket.on("userUpdateStatusClient", async (value = false) => {
                const idx = clients.findIndex(el => el.id === socket.id);
                clients[idx].status = value;
                io.sockets.emit("userUpdateStatusServer", { clients });
            });

            socket.on("banNationsClient", async value => {
                const add = value.status;
                const nationExists = bannedNations.find(el => el.id === value.id);

                if (add) {
                    if (!nationExists) {
                        bannedNations.push({
                            id: value.id,
                            status: value.status,
                            name: value.name,
                            socketId: socket.id,
                        });
                    }
                } else if (nationExists) {
                    const idx = bannedNations.findIndex(el => el.id === value.id);
                    bannedNations.splice(idx, 1);
                }

                io.sockets.emit("banNationsServer", { bannedNations });
            });

            socket.on("startGameClient", async () => {
                io.sockets.emit("startGameServer");
                selectedNations = [];
                const getNationsData = async () => {
                    const data = await readFile("nations.json");
                    return data;
                };
                const nations = await getNationsData();

                const randomedIds = [];
                const users = clients.map(({ name }) => name); // ["1", "qwer"]
                const bannedIds = bannedNations.map(({ id }) => id); // [5, 1, 2] || []
                const allNationsIds = nations.nations.map(item => item.id); // [1, ... 41]
                const nationsIdsForGame = allNationsIds.filter(f => !bannedIds.includes(f));
                const gameIds = [...nationsIdsForGame];

                users.forEach(user => {
                    const obj = {
                        username: user,
                        ids: []
                    };
                    // eslint-disable-next-line no-plusplus
                    for (let index = 0; index < currentCounter; index++) {
                        const randomIdx = Math.floor(Math.random() * (gameIds.length));
                        const currentId = gameIds[randomIdx];
                        obj.ids.push(currentId);
                        gameIds.splice(randomIdx, 1);
                    }

                    randomedIds.push(obj);
                });

                setTimeout(() => {
                    io.sockets.emit("sendRandomedServer", {randomedIds});
                }, 2000);
            });

            socket.on("selectNationClient", async (value) => {
                selectedNations.push(value)
                io.sockets.emit("selectNationServer", {selectedNations});
            });

            socket.on("disconnect", async () => {
                console.log("disconnect", socket.id);
                const idx = clients.findIndex(el => el.id === socket.id);

                if (idx >= 0) {
                    clients.splice(idx, 1);
                    socket.broadcast.emit("leaveServer", { clients });
                }

                const clearedBans = bannedNations.filter(el => el.socketId !== socket.id);
                bannedNations = clearedBans;
                socket.broadcast.emit("banNationsServer", { bannedNations });
            });
        });
    } catch (e) {
        console.log("Server error", e.message);
        process.exit(1);
    }
}

start();
