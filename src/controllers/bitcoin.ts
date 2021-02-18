import * as express from "express";
import { Response, Request, NextFunction } from "express";
import validate from "../middlewares/validators";
import { check, sanitize } from "express-validator";
const router = express.Router();
import { pick } from 'lodash';
import { Currency } from "../models/Currency";
import { CurrenyCode } from "../enums/currency";

/**
 * Update bitcoin
 * @route PUT /bitcoin
 */
router.put('', validate([
    check("price", "Price is not valid").isNumeric()
]), async (req: Request, res: Response, next: NextFunction) => {
    const currency = await Currency.findOneAndUpdate({
        code: CurrenyCode.bitcoin
    }, {
        $set: pick(req.body, ['price'])
    }, {
        new: true,
        upsert: true
    }).catch(next);
    res.send(currency);
});

/**
 * Get Bitcoin Balance
 * @route GET /bitcoin
 */
router.get('', async (req: Request, res: Response, next: NextFunction) => {
    const currency = await Currency.findOne({
        code: CurrenyCode.bitcoin
    }).catch(next);
    res.send(currency);
});


export { router };