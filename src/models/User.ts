import mongoose from "mongoose";

export type UserDocument = mongoose.Document & {
    name: string;
    username: string;
    email: string;
    bitcoinAmount: number;
    usdBalance: number;
};

const userSchema = new mongoose.Schema<UserDocument>(
    {
        name: String,
        username: { type: String, unique: true },
        email: { type: String, unique: true },
        bitcoinAmount: { type: Number, default: 0 },
        usdBalance: { type: Number, default: 0 },
    },
    { timestamps: true },
);

export const User = mongoose.model<UserDocument>("User", userSchema);