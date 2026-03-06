# Push to GitHub checklist

You created the repo but still get **"Repository not found"**. Do these in order.

---

## 1. Run from the project directory

Your terminal prompt was `~` (home). Always run git commands from the project folder:

```bash
cd /Volumes/harundev/NextJS/chivana/chivana-real-estate-clone
```

Then run the push **from here**:

```bash
git remote -v
git push -u origin main
```

You should see:
- `origin  git@github-codeable:codeablecy/chivana.git`

If you see `git@github.com:codeablecy/chivana.git` (no `github-codeable`), the **codeable** SSH key is not used and GitHub may be using another account that has no access to the org repo.

---

## 2. Ensure your codeable SSH key has access to the repo

"Repository not found" often means: **the GitHub account that owns the SSH key you’re using does not have access to that repo.**

- Create the repo under the **organization** that the codeable account belongs to:
  - Go to https://github.com/codeablecy (or your org).
  - Create a **new repository** named exactly `chivana` (no README if you’re pushing existing code).
- The GitHub account that has **id_ed25519_codeable** added (in Settings → SSH keys) must be:
  - A **member of the codeablecy organization**, or
  - Added as a **collaborator** to the repo.

To see which account your codeable key uses:

```bash
ssh -T git@github-codeable
```

GitHub will reply with: "Hi **username**! You've successfully authenticated..."

That **username** must have access to `codeablecy/chivana`.

---

## 3. If the repo is under your user, not the org

If you created the repo under your **personal** account (e.g. `haruntoker/chivana`), then either:

- **Option A:** Push to that repo instead:
  ```bash
  git remote set-url origin git@github-codeable:YOUR_USERNAME/chivana.git
  git push -u origin main
  ```
  (Use your GitHub username and the host that uses your codeable key if it’s on that account.)

- **Option B:** Create the repo under the **codeablecy** organization and push there (with the URL we set: `git@github-codeable:codeablecy/chivana.git`), and ensure the codeable GitHub account is in that org or has access.

---

## 4. One-shot: from project dir, with codeable key

From your Mac terminal (so you can type the passphrase if asked):

```bash
cd /Volumes/harundev/NextJS/chivana/chivana-real-estate-clone
ssh-add -l | grep codeable || ssh-add ~/.ssh/id_ed25519_codeable
git remote -v
git push -u origin main
```

If it still says "Repository not found", the GitHub user that authenticated (from step 2) does not have access to **codeablecy/chivana** — fix org membership or repo visibility/collaborators.
