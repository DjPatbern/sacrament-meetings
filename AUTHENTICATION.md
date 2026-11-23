# Bishopric authentication setup

The create, edit, and delete workflows use Auth.js credentials. Configure these
variables in `.env.local` and in the Vercel project settings:

```bash
AUTH_SECRET="a-long-random-secret"
AUTH_EMAIL="bishopric@example.com"
AUTH_PASSWORD_HASH="a-bcrypt-password-hash"
NEXT_PUBLIC_SITE_URL="https://your-project.vercel.app"
```

Generate `AUTH_SECRET` with `npx auth secret`. Generate the password hash with:

```bash
node -e "import('bcryptjs').then(({ hash }) => hash('replace-with-a-strong-password', 12).then(console.log))"
```

Never commit the real password, hash, or Auth.js secret.
