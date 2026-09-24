# 🚀 Deploy — Git + Vercel

Follow these top to bottom. Run every command **inside the project folder**
(`...\vice-cty\vice-city-snapmatic\vice-city-snapmatic`, where `package.json` is).

---

## 1. Repo

Already created: **https://github.com/m4ik-crtl/vice-city-snapmatic** ✅

## 2. Push the code

```bash
git init
git add .
git commit -m "Vice City Snapmatic — GTA VI photo studio built with React Image Editor"
git branch -M main
git remote add origin https://github.com/m4ik-crtl/vice-city-snapmatic.git
git push -u origin main
```

`node_modules`, `dist` and `.env` are already ignored, so they won't be pushed.

> If the push is rejected because you created the repo **with** a README/license on GitHub,
> sync once and push again:
> ```bash
> git pull --rebase origin main
> git push -u origin main
> ```

## 3. Deploy on Vercel

1. Go to **https://vercel.com/new** and sign in with GitHub.
2. **Import** the `vice-city-snapmatic` repo.
3. Vercel auto-detects **Vite** — Build Command `npm run build`, Output `dist` (already set in `vercel.json`). Leave as is.
4. *(Optional)* to enable the AI Assistant: **Environment Variables** → add
   `VITE_UNLAYER_PROJECT_ID` = your Unlayer project id.
5. Click **Deploy**. In ~1 minute you get a live URL like
   `https://vice-city-snapmatic.vercel.app`.

## 4. Finish up

- Put the **live URL** and the **repo URL** at the top of `README.md` (the two placeholders).
- Commit that small change:
  ```bash
  git add README.md && git commit -m "docs: add live + repo links" && git push
  ```
- Submit both links to the challenge form and post with **#BuiltWithImageEditor**.

---

### Later updates
Any time you change the code:
```bash
git add . && git commit -m "your message" && git push
```
Vercel redeploys automatically on every push to `main`.
