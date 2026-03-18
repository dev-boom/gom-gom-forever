## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy

1. Firebase Login
  `firebase login`
1. init Firebase if needed
  `firebase init`
1. update `.env` files see `.env.example`

### Deploy manually
1. Build
  `npm run build`
2. Deploy
  `firebase deploy`

OR

### Deploy using Github
1. Setup Github Actions envs
1. push to designated branch

Note we use initial template from [Google AI studio](https://ai.studio/apps/216aa767-f236-4352-becf-d069367b09e3)