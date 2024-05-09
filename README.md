# atlar bank project

# contents

- [general notes](#general-notes)
- [specifications](#specifications)
- [example steps](#example-steps)
- [install steps](#install-steps)
- [api documentation (v1)](#api-documentation-v1)
  - [architectural decisions](#architectural-decisions)
- [what i learned and how i reasoned through the project](#what-i-learned-and-how-i-reasoned-through-the-project)
- [things left out or to improve](#things-left-out-or-to-improve)
- [sponsors](#sponsors)

## general notes

- use tech i am used to & show my skills
- i plan to treat it as a project, not an interview assignment
- write a bank api with accounts and transactions
- parse as much data as possible
- my aim is to focus on quality & stability over quantity
- stack used: `node`, `express`, `typescript`, `jest`, `supertest`, `xml2js`, `dotenv`, `nodemon`

## install steps

1. run these commands:

```bash
brew install node # or visit https://nodejs.org/en/download/

# clone the repo
git clone https://github.com/neontomo/atlar-bank-project.git
cd atlar-bank-project

# install dependencies
npm install

# rename the `example.env` file
mv .env.example .env

# run the server
npm run dev # development
npm run build && npm run start # production

# run tests if you want,
# it checks the api endpoints
# for valid data & response codes
npm run test
```

2. open the browser and go to http://localhost:3000/api/v1/
3. use the api endpoints to get, update or delete data. e.g. `GET http://localhost:3000/api/v1/accounts` or use `postman` to make other types of requests than `GET`.

## api documentation (v1)

**available endpoints:**

- `GET` /api/v1/accounts
  - get all accounts
- `GET` /api/v1/accounts/{accountNumber}
  - get a specific account
- `GET` /api/v1/accounts/{accountNumber}/transactions
  - get all transactions for a specific account
- `PATCH` /api/v1/accounts/{accountNumber}
  - update a specific account with new data, returns the new object
  - params available:
    - `accountNumber`
    - `currency`
    - `ownerName`
    - `balance`
    - `balanceAmount`
    - `balanceCurrency`
    - `balanceDate`
- `DELETE` /api/v1/accounts/{accountNumber}
  - delete a specific account

**error codes:**

- `400` - bad request
- `404` - not found
- `500` - internal server error
- `200` - ok

## architectural decisions:

- undefined data is set to `null`, to make it clear that the data is missing
- numbers are stored as strings just in case there are formatting issues with dots and commas
- renamed the api responses to be more descriptive - `accountNumber` instead of `Id>Othr` for example

## specifications

### inputs

- `camt.053` file (`iso20022` standard)
  - end-of-day bank statements that report balances and transactions of the previous business day to a company

### outputs

- `JSON` data (restful design principles)
- minimum data to parse:
  - account `Acct`
    - account number `Id>Othr`
    - currency
    - owner name
    - balance `Bal`
  - transactions `Ntry` and accompanying details `Dtls`
    - booking date
    - amount and currency
    - remittance information `RmtInf`
    - unique identifier

### server & db

- use a typed language (not specified which)
- no db (in-memory) or real db (optional)

### resources:

- [practical camt.053 guide](https://www.sepaforcorporates.com/swift-for-corporates/a-practical-guide-to-the-bank-statement-camt-053-format/)
- [seb's camt.053 doc](https://drive.google.com/file/d/1EHj3mvwB0XCTSLbhpxK83_3GnR6NIlLy/view)

## example steps

- start the server
- read and parse the `camt.053` file
- store the parsed data in-memory
- parse the data
  - account
    - account number, currency, owner name, balance
  - transactions
    - booking date, amount and currency, remittance information, unique identifier
- create endpoints
  - get & list accounts, list transactions for an account, update an account, delete an account
- user accesses the api endpoints
- output the data in `JSON` format
- example json:

  ```json
  [
    {
      "accountNumber": "54400001111",
      "currency": "SEK",
      "ownerName": "TEST Customer",
      "balance": {
        "amount": "3865371.31",
        "currency": "SEK",
        "date": "2018-12-17"
      }
    },
    {
      "accountNumber": "3947876",
      "currency": "SEK",
      "ownerName": "Bobby",
      "balance": {
        "amount": null,
        "currency": null,
        "date": null
      }
    }
  ]
  ```

## what i learned and how i reasoned through the project

i learned a lot about how banking systems work and how data is stored and sent. it surprised me that the banks `camt` format wasn't at all semantic, leading to more research than would have otherwise been necessary. despite this, i saw the value in the rigidity and predictable structure of the format and enjoyed understanding the specs.

while designing the api, i researched best practices and tried to strike a balance between doing things correctly while still getting code out the door quickly. the way i did this is by iterating and accepting that code is by its nature a work in progress, but focused more strongly on specific method ideas that people expect from the protocol such as error handling, common route structures, future proofing with api versions and so on.

i didn't work much with the raw xml, as i immediately converted it into json, a format i'm more comfortable in. i re-learned that json is a great format for storing and outputing data, but much harder to search through effectively while allowing for some flexibility in the data structure and types. i started to research packages for quickly searching through json with query languages and even looked at graphql (outside the scope of the project tho), but realised i didn't trust that there was enough consensus on which tools are stable (important in banking).

I used a `.env` file to store the port and other variables, which is a common practice. I also used a `config` file to store the api version.

i spent a lot of my time considering stability and to some degree followed the [robustness principle](https://en.wikipedia.org/wiki/robustness_principle), be conservative in your outputs, liberal in your inputs.

## things left out or to improve

- **inspiration** - if i had more time i would have looked more at other implementations of the `camt053` format.

- **non-semantic api** - since my api renames values to be more semantic, i also considered making a separate api route that outputs the original values, for mission critical systems.

- **structured doc** - i looked at atlars own api documentation which pointed me in the right direction a few times, i would have loved to have built out a more structured api doc like it.

- **security** - auth is something i skipped - not only because it would have taken time, but because i don't understand exactly who is using this particular api, which would influence my strategy. in general, i would implement a bearer/JWS token and send it with each request. other nice things:

  - rate limiting & not sending too much data at once
  - logging (request IDs, IP, etc.)
  - more systematic error handling (correct status codes and messages)

- **scaling** - if this was used in production, it would be good to think about load balancing and serverless auto-scaling and which database scales best with the data. i would also consider using a cache for the data.

- **user feedback** - understanding which endpoints are most useful, and investigating how easily the user can get started with the docs would be a good next step.

## sponsors

sponsored by Mountain Dew™️ - your favorite drink for coding and gaming.

use the code `hire-tomo-at-atlar` for 10% off your next purchase.

![mountaindew](https://github.com/neontomo/atlar-bank-project/assets/105588693/3df20a06-a30b-4d08-8443-6574ff3b99f0)
