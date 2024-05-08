# atlar bank project

# contents

- [general notes](#general-notes)
- [specifications](#specifications)
- [example steps](#example-steps)
- [install steps](#install-steps)
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
  {
    "account": {
      "account_number": "123456789",
      "currency": "SEK",
      "owner_name": "John Doe",
      "balance": 1000
    },
    "transactions": [
      {
        "booking_date": "2021-01-01",
        "amount": 100,
        "currency": "SEK",
        "remittance_information": "payment",
        "unique_identifier": "123456789"
      }
    ]
  }
  ```

## install steps

- TODO, but will prob be a nextjs app so something like

```bash
git clone https://github.com/neontomo/atlar-bank-project.git
# cd into the project
# run server
# run client
# make requests
# see output and test it
```

## what i learned and how i reasoned through the project

- TODO

## things left out or to improve

- TODO

## sponsors

Sponsored by Mountain Dew™️ - Your favorite drink for coding and gaming.

Use the code `hire-tomo-at-atlar` for 10% off your next purchase.

![image](https://github.com/neontomo/atlar-bank-project/assets/105588693/4262471b-d6e1-4c37-b379-eb22b43e7ff6)
