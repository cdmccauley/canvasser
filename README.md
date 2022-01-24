## Canvasser

## TODO
Create an actual README.md

## Notes
Production can be viewed at [https://canvasser.vercel.app/](https://canvasser.vercel.app/)
Branch 0.3 can be previewed at [https://canvasser-git-03-ncode.vercel.app/](https://canvasser-git-03-ncode.vercel.app/)

## Configuration

### Set up environment variables

Copy the `env.local.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.local.example .env.local
```

Set each variable on `.env.local`:

#### Canvasser 0.3 environment variables

- `MONGODB_URI` - MongoDB connection string
- `MONGODB_DB` - MongoDB database name
- `CLIENT_ID` - Canvas ID
- `CLIENT_SECRET` - Canvas API key

#### Canvasser 0.2 environment variables

- `MONGO_CONNECTION` - MongoDB connection string
- `MONGO_DB` - MongoDB database name
- `MONGO_COLLECTION` - MongoDB collection name
- `I_KEY` - Interface key

### Run Next.js in development mode

```bash
npm install
npm run dev

# or

yarn install
yarn dev
```

Your app should be up and running on [http://localhost:3000](http://localhost:3000).

## Contributers

Chris McCauley