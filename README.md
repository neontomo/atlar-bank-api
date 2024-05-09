# atlar bank project

# contents

- [general notes](#general-notes)
- [specifications](#specifications)
- [example steps](#example-steps)
- [install steps](#install-steps)
- [api documentation](#api-documentation)
  - [architectural decisions](#architectural-decisions)
- [what i learned and how i reasoned through the project](#what-i-learned-and-how-i-reasoned-through-the-project)
- [things left out or to improve](#things-left-out-or-to-improve)
- [sponsors](#sponsors)

## general notes

- use tech i am used to & show my skills
- i plan to treat it as a project, not an interview assignment
- write a bank api with accounts and transactions
- parse as much data as possible
- presumed stack: `typescript`, `nodejs`, `express`, etc.

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

### server

- use a typed language (not specified which)

### database

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
    - account number
    - currency
    - owner name
    - balance
  - transactions
    - booking date
    - amount and currency
    - remittance information
    - unique identifier
- create endpoints
  - get and list accounts
  - list transactions for an account
- user accesses the api endpoints
- output the data in `JSON` format
- example json (this might change when i learn more):

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
mv example.env .env

# run the server
npm run dev # development
npm run build && npm run start # production
```

2. open the browser and go to http://localhost:3000
3. use the api endpoints to get and list accounts and transactions (in your browser or with a tool like `postman`)

## api documentation

make a request to the following endpoints with `x-www-form-urlencoded` data:

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
- more coming...

## architectural decisions:

- undefined data is set to `null`, to make it clear that the data is missing
- numbers are stored as strings just in case there are formatting issues with dots and commas
- renamed the api responses to be more descriptive

## what i learned and how i reasoned through the project

- TODO

## things left out or to improve

- TODO

## sponsors

Sponsored by Mountain Dew™️ - Your favorite drink for coding and gaming.

Use the code `hire-tomo-at-atlar` for 10% off your next purchase.

![image](https://github.com/neontomo/atlar-bank-project/assets/105588693/4262471b-d6e1-4c37-b379-eb22b43e7ff6)
