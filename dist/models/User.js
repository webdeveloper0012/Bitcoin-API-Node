"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    bitcoinAmount: { type: Number, default: 0 },
    usdBalance: { type: Number, default: 0 },
}, { timestamps: true });
exports.User = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=User.js.map