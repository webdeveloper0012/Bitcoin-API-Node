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
const validators_1 = __importDefault(require("../middlewares/validators"));
const express_validator_1 = require("express-validator");
const router = express.Router();
exports.router = router;
const lodash_1 = require("lodash");
const Currency_1 = require("../models/Currency");
const currency_1 = require("../enums/currency");
/**
 * List of API examples.
 * @route GET /api
 */
router.put('', validators_1.default([
    express_validator_1.check("price", "Price is not valid").isNumeric()
]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currency = yield Currency_1.Currency.findOneAndUpdate({
        code: currency_1.CurrenyCode.bitcoin
    }, {
        $set: lodash_1.pick(req.body, ['price'])
    }, {
        new: true,
        upsert: true
    }).catch(next);
    res.send(currency);
}));
router.get('', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currency = yield Currency_1.Currency.findOne({
        code: currency_1.CurrenyCode.bitcoin
    }).catch(next);
    res.send(currency);
}));
//# sourceMappingURL=bitcoin.js.map