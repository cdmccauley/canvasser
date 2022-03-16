# Canvasser

Production can be viewed at [https://canvasser.vercel.app/](https://canvasser.vercel.app/)

Branch 0.3 can be previewed at [https://canvasser-git-03-ncode.vercel.app/](https://canvasser-git-03-ncode.vercel.app/)

## Dev Configuration

### Environment Variables

Credentials will only be provided to trusted contributors, contact [chris.mccauley@davistech.edu](mailto:chris.mccauley@davistech.edu).

Copy the `env.local.example` file in this directory to `.env.local` (which will be ignored by Git)

Provide values for each variable in `.env.local`

#### Canvasser 0.3 Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `MONGODB_DB` - MongoDB database name
- `CLIENT_ID` - Canvas ID
- `CLIENT_SECRET` - Canvas API key
- `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA` - String value of 'DEVELOPMENT'

#### Canvasser 0.2 Environment Variables

- `MONGO_CONNECTION` - MongoDB connection string
- `MONGO_DB` - MongoDB database name
- `MONGO_COLLECTION` - MongoDB collection name
- `I_KEY` - Interface key

### Run Next.js in development mode

```
npm install
npm run dev

# or

yarn install
yarn dev
```

Your app should be up and running on [http://localhost:3000](http://localhost:3000).

## License

Licensed under GNU General Public License v3.0

See the file COPYING in the root directory for more details.

[https://choosealicense.com/licenses/gpl-3.0/#](https://choosealicense.com/licenses/gpl-3.0/#)

## Contributors

Chris McCauley