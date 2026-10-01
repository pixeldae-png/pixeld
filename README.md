# PIXELD portfolio

Production Vite/React portfolio with a Supabase-backed project admin and a server-side Resend contact endpoint.

## Local development

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env` and fill in the values.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open `http://localhost:5173`; admin is at `/admin`.

The contact function runs through Netlify Dev (`npx netlify dev`), not the plain Vite server.

## Supabase setup

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/migrations/001_pixeld_projects.sql` in full.
3. In Authentication → Users, create Khalid's admin user with email/password and mark the email confirmed.
4. Copy that user's UUID and run:

```sql
insert into public.admin_users (user_id) values ('PASTE_AUTH_USER_UUID_HERE');
```

5. Put the Project URL in `SUPABASE_URL` and the publishable/anon key in `SUPABASE_ANON_KEY`. Never use the service-role key in browser code. `SUPABASE_SERVICE_ROLE_KEY` is reserved for future server-only tasks and is not used by this app.
6. Confirm the `project-images` public bucket exists in Storage; the migration creates it and its policies.

## Netlify deployment

1. Push the project to a Git repository and import it in Netlify.
2. Netlify reads `netlify.toml`: build command `npm run build`, publish directory `dist`, functions directory `netlify/functions`.
3. In Site configuration → Environment variables, add every variable below for Production (and Preview if desired).
4. Deploy. Verify `/admin` directly and refresh it to confirm the SPA redirect.
5. In Supabase Authentication → URL Configuration, set Site URL to the final Netlify/custom domain and add the preview URL pattern if previews are used.
6. In Resend, verify the sending domain and use an address on it for `RESEND_FROM_EMAIL`.

## Environment variables

```dotenv
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=PIXELD <website@your-verified-domain.com>
CONTACT_RECEIVER_EMAIL=your-inbox@example.com
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=
```

`RESEND_API_KEY`, email addresses, and the service-role key are server-only. Vite exposes only the Supabase URL and anon key through build-time constants; RLS provides authorization.

## Before launch

- Verify the editable stats and public content in `src/config/site.js`.
- Add real Instagram and TikTok URLs to the same config; empty links remain hidden.
- Add only genuine testimonials to the central `testimonials` array; the section is hidden while empty.
- Replace `/public/og-image.png` if a dedicated social-share graphic becomes available.
- Test a real contact submission on the deployed domain.
- Create, edit, reorder, feature, hide, upload gallery images to, and delete a disposable project through `/admin`.
