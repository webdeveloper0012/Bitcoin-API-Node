"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Currency = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const currencySchema = new mongoose_1.default.Schema({
    code: { type: String },
    price: { type: Number, default: 100 },
}, { timestamps: true });
exports.Currency = mongoose_1.default.model("Currency", currencySchema);
//# sourceMappingURL=Currency.js.map