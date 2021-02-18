
import mongoose from "mongoose";

export type CurrencyDocument = mongoose.Document & {
    code: string;
    price: number;
};

const currencySchema = new mongoose.Schema<CurrencyDocument>(
    {
        code: { type: String },
        price: { type: Number, default: 100 },
    },
    { timestamps: true },
);

export const Currency = mongoose.model<CurrencyDocument>("Currency", currencySchema);