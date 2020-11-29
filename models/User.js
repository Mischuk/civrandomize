const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: [{ type: Types.ObjectId, ref: "Profile" }],
});

module.exports = model("User", schema);
