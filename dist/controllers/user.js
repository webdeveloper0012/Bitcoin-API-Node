"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express = __importStar(require("express"));
const router = express.Router();
exports.router = router;
const express_validator_1 = require("express-validator");
const User_1 = require("../models/User");
const lodash_1 = require("lodash");
const validators_1 = __importDefault(require("../middlewares/validators"));
const Currency_1 = require("../models/Currency");
const currency_1 = require("../enums/currency");
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield User_1.User.findById(id).catch(next);
    if (!user) {
        return next({ code: 404, message: 'User not found' });
    }
    res.send(user);
}));
router.get('/:userId/balance', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const user = yield User_1.User.findOne({ _id: userId });
    if (!user) {
        return next({ code: 404, message: 'User not found' });
    }
    const bitcoin = yield Currency_1.Currency.findOne({ code: currency_1.CurrenyCode.bitcoin });
    const balance = user.usdBalance + (user.bitcoinAmount * bitcoin.price);
    res.send({ balance });
}));
/**
 * List of API examples.
 * @route GET /api
 */
router.post('', validators_1.default([
    express_validator_1.check("email", "Email is not valid").isEmail(),
    express_validator_1.check("name", "Name is not valid").isLength({ min: 3, max: 50 }),
    express_validator_1.check("username", "Password must be at least 4 characters long").isLength({ min: 4, max: 50 }),
    express_validator_1.sanitize("email").normalizeEmail({ gmail_remove_dots: false })
]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.create(lodash_1.pick(req.body, ['name', 'username', 'email'])).catch(next);
    res.send(user);
}));
router.post('/:userId/usd', validators_1.default([
    express_validator_1.check("action", "Action is invalid").isIn(['withdraw', 'deposit']),
    express_validator_1.check("amount", "Amount is invalid").isNumeric()
]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const user = yield User_1.User.findOne({ _id: userId });
    if (!user) {
        return next({ code: 404, message: 'User not found' });
    }
    const { action, amount } = req.body;
    let changeInBalance = 0;
    if (action === 'withdraw') {
        if (user.usdBalance < amount) {
            return next({ code: 400, message: 'Insufficient funds' });
        }
        changeInBalance = -amount;
    }
    else {
        changeInBalance = amount;
    }
    user.usdBalance += changeInBalance;
    yield user.save();
    res.send(user);
}));
router.post('/:userId/bitcoins', validators_1.default([
    express_validator_1.check("action", "Action is invalid").isIn(['buy', 'sell']),
    express_validator_1.check("amount", "Amount is invalid").isNumeric()
]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const user = yield User_1.User.findOne({ _id: userId });
    if (!user) {
        return next({ code: 404, message: 'User not found' });
    }
    const bitcoin = yield Currency_1.Currency.findOne({ code: currency_1.CurrenyCode.bitcoin });
    const { action, amount } = req.body;
    let changeInBitcoin = 0;
    let changeInUsd = 0;
    if (action === 'buy') {
        changeInBitcoin = amount;
    }
    else {
        if (amount > user.bitcoinAmount) {
            return next({ code: 400, message: 'Insufficient funds' });
        }
        changeInBitcoin = -amount;
        changeInUsd += amount * bitcoin.price;
    }
    user.bitcoinAmount += changeInBitcoin;
    user.usdBalance += changeInUsd;
    yield user.save();
    res.send(user);
}));
router.put('/:id', validators_1.default([
    express_validator_1.check("email", "Email is not valid").isEmail(),
    express_validator_1.check("name", "Name is not valid").isLength({ min: 3, max: 50 }),
    express_validator_1.sanitize("email").normalizeEmail({ gmail_remove_dots: false })
]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield User_1.User.findOneAndUpdate({
        _id: id
    }, {
        $set: lodash_1.pick(req.body, ['name', 'email'])
    }, {
        new: true
    }).catch(next);
    if (!user) {
        return next({ code: 404, message: 'User not found' });
    }
    res.send(user);
}));
//# sourceMappingURL=user.js.map