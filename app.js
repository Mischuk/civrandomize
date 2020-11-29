const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { MONGO_URL, PORT } = require("./core/constants");

const app = express();
app.use(express.json({ extended: true}));

app.use("/api/auth", require("./routes/auth.routes"));

if ( process.env.NODE_ENV === "production" ) {
    app.use("/", express.static(path.join(__dirname, "client", "build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    });
}

async function start() {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        app.listen(5000, () => console.log(`App has been started at port ${PORT}...`));
    } catch (e) {
        console.log("Server error", e.message);
        process.exit(1);
    }
}

start();
