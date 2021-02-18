## Requirements

* Node 10 or above

## Common setup

download code

```bash
cd testbtc
```

```bash
npm install
```

## Steps for read-only access

To start the express server, run the following

```bash
npm run start
```

Server will start at [http://localhost:8080]

Foolowing are the details of APIS
```
/**
 * Retrieves user object.
 * @route GET /users/:id
 */
```

```
/**
 * Retrieves user balance.
 * @route GET /users/:userId/balance
 */
```

```
/**
 * Create user.
 * @route POST /users
 */
```

```
/**
 * Withdraw/Deposit USD.
 * @route POST /users/:userId/usd
 */
```

```
/**
 * Buy/Sell Bitcoins.
 * @route POST /users/:userId/bitcoins
 */
```

```
/**
 * Update User
 * @route PUT /users/:id
 */
```


```
/**
 * Update bitcoin
 * @route PUT /bitcoin
 */
```

```
/**
 * Get Bitcoin Balance
 * @route GET /bitcoin
 */
```

```
Postman Collection Link: https://www.getpostman.com/collections/af0e1d6ba1b1ca733372
```