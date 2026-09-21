# 🔧 Troubleshooting Guide

## Issue: Destination Cards Not Working / Not Showing

### Possible Causes & Solutions:

### 1. **Empty Database** ❌
**Problem:** The `packages` table in Supabase is empty.

**Solution:**
```bash
# Option A: Run the seeding script
npx tsx src/scripts/seed-packages.ts

# Option B: Manually add packages via Supabase Dashboard
# Go to: https://app.supabase.com → Your Project → Table Editor → packages
```

**Required Package Fields:**
- `title` (text) - Package name
- `slug` (text) - URL-friendly identifier (e.g., "thailand-phuket-bangkok")
- `description` (text) - Package description
- `price` (numeric) - Price in INR
- `duration` (text) - e.g., "6 Days / 5 Nights"
- `image_url` (text) - Full image URL
- `highlights` (text[]) - Array of highlight strings
- `is_active` (boolean) - Set to `true`

---

### 2. **Missing Environment Variables** 🔑
**Problem:** Supabase credentials not configured.

**Solution:**
Create/check `.env.local` file in project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from:
Supabase Dashboard → Project Settings → API → Project URL & anon public key

**After adding env variables:**
```bash
# Restart the dev server
npm run dev
```

---

### 3. **Missing Slug Values** 🏷️
**Problem:** Packages exist but don't have `slug` values.

**Check Console Logs:**
Look for warnings like: `⚠️ Package missing slug: 123 Thailand Tour`

**Solution:**
Update packages in Supabase to include unique slug values:
- Thailand tour → `thailand-phuket-bangkok`
- Bali tour → `bali-ubud-seminyak`
- Format: lowercase, hyphenated, no special characters

---

### 4. **Database Connection Error** 🔌
**Problem:** Cannot connect to Supabase.

**Check:**
1. Environment variables are correct
2. Supabase project is active (not paused)
3. No network/firewall issues
4. Check browser console for specific errors

**Solution:**
```bash
# Test connection
curl https://your-project.supabase.co/rest/v1/
```

---

### 5. **Packages Not Active** 🚫
**Problem:** Packages exist but `is_active` is false.

**Solution:**
Update packages in Supabase:
```sql
UPDATE packages SET is_active = true WHERE is_active = false;
```

---

## Debugging Steps:

### 1. Check Browser Console
Open Developer Tools (F12) and look for:
- Supabase debug logs
- Error messages
- Package count

### 2. Check Server Logs
Look at terminal where `npm run dev` is running for:
```
=== SUPABASE PACKAGES DEBUG ===
Packages count: 0
```

### 3. Verify Database Structure
In Supabase, ensure the `packages` table exists with correct schema:

```sql
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC,
  duration TEXT,
  image_url TEXT,
  highlights TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Test Individual Package Page
Try accessing a package directly:
```
http://localhost:3000/destinations/thailand-phuket-bangkok
```

If this shows "404 - Not Found", the package doesn't exist or slug is wrong.

---

## Quick Fix Checklist ✅

- [ ] `.env.local` exists with Supabase credentials
- [ ] Dev server restarted after adding env variables
- [ ] `packages` table exists in Supabase
- [ ] At least one package in database with `is_active = true`
- [ ] Each package has a unique `slug` value
- [ ] Image URLs are valid and accessible
- [ ] Browser console shows no errors
- [ ] Server logs show "Successfully fetched X packages"

---

## Still Not Working?

### Check Homepage Debug Info
The homepage now shows helpful debug information:
- 🔴 Red box = Database connection error
- 🟡 Yellow box = No packages found (with instructions)

### Need Help?
1. Check server logs for specific error messages
2. Verify Supabase dashboard → Table Editor → packages has data
3. Try running the seed script: `npx tsx src/scripts/seed-packages.ts`
4. Check that RLS (Row Level Security) policies allow reading packages

---

## Common Supabase Issues:

### RLS (Row Level Security) Blocking Access
If you have RLS enabled, you need a policy to allow public reads:

```sql
-- Allow public to read active packages
CREATE POLICY "Allow public read access to active packages"
ON packages
FOR SELECT
TO public
USING (is_active = true);
```

### Project Paused
Free Supabase projects pause after inactivity. Visit your dashboard to unpause.

---

## Success Indicators 🎉

You'll know it's working when:
1. Homepage shows package cards with images
2. Console logs: `✅ Successfully fetched X packages`
3. Clicking "View Full Itinerary" navigates to `/destinations/[slug]`
4. Individual destination pages load with full details
5. No red/yellow debug boxes on homepage
