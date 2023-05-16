# bluechat 💙

ChatGPT hooked up to 100+ articles on Canadian violence

### The story in a tweet

https://twitter.com/aleemrehmtulla/status/tweet_id

### Setup

1. Clone the repo
2. `npm install`
3. Fill out the `.env` file as per the `.env.example`
4. Setup your database: `ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts`
5. `npm run dev`

### Deploy to the world

1. Push all your changes to Github (or another git provider)
2. Head to vercel.app, import your repo, and hit deploy
3. Go to settings of the deployment, add your .env, and rebuild

### To contribute

I would greatly appreciate any contributions to this project!! Adding data in `/prisma/data.json` is the most impactful way to contribute, allowing the LLM to learn more about Canadian violence.

Feel free to open an issue or PR if you have any questions or concerns, or if you want to change something else in the codebase (:

#### Connect w/ me!

https://twitter.com/aleemrehmtulla

https://aleemrehmtulla.com

https://www.linkedin.com/in/aleemrehmtulla/
