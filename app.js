const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const { MONGO_URL, PORT } = require("./core/constants");

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
        // io.sockets.emit("users_count", clients);


        io.on("connection", (socket) => {
            console.log("connection", socket.id);

            socket.on("joinClient", async (data) => {
                const newUser = {name: data.userName, id: socket.id};
                clients.push(newUser);
                io.sockets.emit("joinServer", { clients });
            });

            socket.on("disconnect", async () => {
                console.log("disconnect", socket.id);
                const idx = clients.findIndex(el => el.id === socket.id);
                clients.splice(idx, 1);
                socket.broadcast.emit("leaveServer", { clients });
            });
        });



    } catch (e) {
        console.log("Server error", e.message);
        process.exit(1);
    }
}

start();
