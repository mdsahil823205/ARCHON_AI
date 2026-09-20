import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false
    },
    credits: {
        type: Number,
        default: 500,
        min: 0
    },
    plans: {
        type: String,
        enum: ["free", "pro", "enterprise"],
        default: "free"
    },

}, { timestamps: true })

const User = mongoose.model("User", userSchema)
export default User