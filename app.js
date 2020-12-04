const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

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


        io.on("connection", (socket) => {
            console.log("connection", socket.id);

            socket.on("joinClient", async (data) => {
                const newUser = {name: data.userName, id: socket.id, status: false};
                if ( !clients.find(({name}) => name === data.userName) ) {
                    clients.push(newUser);
                }

                io.emit("joinServer", { clients });
                io.emit("banNationsServer", { bannedNations });
                io.emit("updateCounterServer", { currentCounter });
            });

            socket.on("updateCounterClient", async (value) => {
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

            socket.on("banNationsClient", async (value) => {
                const add = value.status;
                const nationExists = bannedNations.find(el => el.id === value.id);

                if ( add ) {
                    if (!nationExists)  {
                        bannedNations.push({id: value.id, status: value.status, name: value.name, socketId: socket.id});
                    }
                } else if ( nationExists ) {
                        const idx = bannedNations.findIndex(el => el.id === value.id);
                        bannedNations.splice(idx, 1);
                    }

                io.sockets.emit("banNationsServer", { bannedNations });
            });

            socket.on("disconnect", async () => {
                console.log("disconnect", socket.id);
                const idx = clients.findIndex(el => el.id === socket.id);

                if ( idx >= 0 ) {
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
