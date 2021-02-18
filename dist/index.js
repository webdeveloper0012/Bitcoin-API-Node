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
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const port = 8080; // default port to listen
const Currency_1 = require("./models/Currency");
const currency_1 = require("./enums/currency");
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoServer = new mongodb_memory_server_1.MongoMemoryServer({
    binary: {
        version: "4.2.8"
    }
});
mongoose_1.default.Promise = Promise;
mongoServer.getUri().then((mongoUri) => {
    const mongooseOpts = {
        // options for mongoose 4.11.3 and above
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000
    };
    mongoose_1.default.connect(mongoUri, mongooseOpts);
    mongoose_1.default.connection.on('error', (e) => {
        if (e.message.code === 'ETIMEDOUT') {
            // tslint:disable-next-line:no-console
            console.log(e);
            mongoose_1.default.connect(mongoUri, mongooseOpts);
        }
        // tslint:disable-next-line:no-console
        console.log(e);
    });
    mongoose_1.default.connection.once('open', () => __awaiter(void 0, void 0, void 0, function* () {
        // tslint:disable-next-line:no-console
        console.log(`MongoDB successfully connected to ${mongoUri}`);
        const bitcoin = yield Currency_1.Currency.findOne({ code: currency_1.CurrenyCode.bitcoin });
        if (!bitcoin) {
            yield Currency_1.Currency.create({ code: currency_1.CurrenyCode.bitcoin });
        }
    }));
});
// Controllers (route handlers)
const userController = __importStar(require("./controllers/user"));
const bitcoinController = __importStar(require("./controllers/bitcoin"));
app.use(express_1.default.json()); // Used to parse JSON bodies
// define a route handler for the default home page
// app.get( "/", ( req, res ) => {
//     // render the index template
//     res.render( "index" );
// });
app.use('/users', userController.router);
app.use('/bitcoin', bitcoinController.router);
app.use((err, req, res, next) => {
    if (err.name === 'MongoError' && err.code === 11000) {
        const value = err.message.match(/.*dup key.*\"(.*)\"/)[1];
        if (value) {
            return res.status(400).send({ errors: [{
                        msg: `${value} already exists`,
                    }] });
        }
    }
    else if ([404, 400].includes(err.code)) {
        return res.status(err.code).send({ errors: [{
                    msg: err.message
                }] });
    }
    res.status(500).send({ message: 'Something went wrong' });
    // tslint:disable-next-line:no-console
    console.error(err);
});
// start the express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map