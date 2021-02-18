import * as express from "express";
import { Response, Request, NextFunction } from "express";
const router = express.Router();
import { check, sanitize } from "express-validator";
import { User, UserDocument } from "../models/User";
import { pick } from 'lodash';
import validate from '../middlewares/validators'
import { Currency } from "../models/Currency";
import { CurrenyCode } from "../enums/currency";

/**
 * Retrieves user object.
 * @route GET /users/:id
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findById(id).catch(next);
    if (!user) {
        return next({ code: 404, message: 'User not found' });
    }
    res.send(user);
});

/**
 * Retrieves user balance.
 * @route GET /users/:userId/balance
 */
router.get('/:userId/balance', async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
    if (!user) {
        return next({ code: 404, message: 'User not found' });
    }
    const bitcoin = await Currency.findOne({code: CurrenyCode.bitcoin});
    const balance = user.usdBalance + (user.bitcoinAmount * bitcoin.price);
    res.send({ balance });
});

/**
 * Create user.
 * @route POST /users
 */
router.post('', validate([
    check("email", "Email is not valid").isEmail(),
    check("name", "Name is not valid").isLength({ min: 3, max: 50 }),
    check("username", "Password must be at least 4 characters long").isLength({ min: 4, max: 50 }),
    sanitize("email").normalizeEmail({ gmail_remove_dots: false })
]), async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.create(pick(req.body, ['name', 'username', 'email'])).catch(next);
    res.send(user);
});

/**
 * Withdraw/Deposit USD.
 * @route POST /users/:userId/usd
 */
router.post('/:userId/usd',
validate([
    check("action", "Action is invalid").isIn(['withdraw', 'deposit']),
    check("amount", "Amount is invalid").isNumeric()
]),
 async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
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
    } else {
        changeInBalance = amount;
    }

    user.usdBalance += changeInBalance;
    await user.save();

    res.send(user);
});

/**
 * Buy/Sell Bitcoins.
 * @route POST /users/:userId/bitcoins
 */
router.post('/:userId/bitcoins',
validate([
    check("action", "Action is invalid").isIn(['buy', 'sell']),
    check("amount", "Amount is invalid").isNumeric()
]), async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
    if (!user) {
        return next({ code: 404, message: 'User not found' });
    }
    const bitcoin = await Currency.findOne({code: CurrenyCode.bitcoin});
    const { action, amount } = req.body;
    let changeInBitcoin = 0;
    let changeInUsd = 0;
    if (action === 'buy') {
        changeInBitcoin = amount;
    } else {
        if (amount > user.bitcoinAmount) {
            return next({ code: 400, message: 'Insufficient funds' });
        }
        changeInBitcoin = -amount;
        changeInUsd += amount * bitcoin.price;
    }

    user.bitcoinAmount += changeInBitcoin;
    user.usdBalance += changeInUsd;
    await user.save();

    res.send(user);
});

/**
 * Update User
 * @route PUT /users/:id
 */
router.put('/:id',validate([
    check("email", "Email is not valid").isEmail(),
    check("name", "Name is not valid").isLength({ min: 3, max: 50 }),
    sanitize("email").normalizeEmail({ gmail_remove_dots: false })
]), async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findOneAndUpdate({
        _id: id
    }, {
        $set: pick(req.body, ['name', 'email'])
    }, {
        new: true
    }).catch(next);

    if (!user) {
        return next({ code: 404, message: 'User not found' });
    }
    res.send(user);
});

export { router };