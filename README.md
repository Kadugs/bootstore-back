# bootstore-back
Backend code of https://github.com/Kadugs/bootstore-front

## Getting started

### Running locally

1- Clone this repo using git clone https://github.com/Kadugs/bootstore-back.git

2- Install the npm packages `npm install`

3- Create a database using postgres from `dump.sql` file

4- Create an `.env` file based on `.env.template`

5- Run with `npm run local`

If you want to use automated tests, create another db named `bootstore_test` with the same dump and create an .env.test,
then run `npm run test`
