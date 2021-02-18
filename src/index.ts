import express, { NextFunction, Request, Response } from "express";
const app = express();
const port = 8080; // default port to listen

import { Currency } from "./models/Currency";
import { CurrenyCode } from "./enums/currency";
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
const mongoServer = new MongoMemoryServer({
    binary: {
        version: "4.2.8"
    }
});
mongoose.Promise = Promise;
mongoServer.getUri().then((mongoUri) => {
    const mongooseOpts = {
        // options for mongoose 4.11.3 and above
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000
    };

    mongoose.connect(mongoUri, mongooseOpts);

    mongoose.connection.on('error', (e) => {
        if (e.message.code === 'ETIMEDOUT') {
            // tslint:disable-next-line:no-console
            console.log(e);
            mongoose.connect(mongoUri, mongooseOpts);
        }
        // tslint:disable-next-line:no-console
        console.log(e);
    });

    mongoose.connection.once('open', async () => {
        // tslint:disable-next-line:no-console
        console.log(`MongoDB successfully connected to ${mongoUri}`);

        const bitcoin = await Currency.findOne({ code: CurrenyCode.bitcoin });
        if (!bitcoin) {
            await Currency.create({ code: CurrenyCode.bitcoin });
        }
    });
});

// Controllers (route handlers)
import * as userController from "./controllers/user";
import * as bitcoinController from "./controllers/bitcoin";

app.use(express.json()); // Used to parse JSON bodies

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send('H')
});

app.use('/users', userController.router);
app.use('/bitcoin', bitcoinController.router);

interface ServerError extends Error {
    code: number
}

app.use((err: ServerError, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'MongoError' && err.code === 11000) {
        const value = err.message.match(/.*dup key.*\"(.*)\"/)[1];
        if (value) {
            return res.status(400).send({ errors: [{
                msg: `${value} already exists`,
            }]});
        }
    }
    else if ([404, 400, 423].includes(err.code)) {
        return res.status(err.code).send({ errors: [{
            msg: err.message
        }]});
    }
    res.status(500).send({ message: 'Something went wrong' });
    // tslint:disable-next-line:no-console
    console.error(err);
})

// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
});
