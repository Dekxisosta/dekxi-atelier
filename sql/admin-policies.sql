-- Run this in Supabase SQL Editor AFTER creating your admin user
-- (Authentication → Users → Add user), and after copying that user's UUID.

-- Replace every occurrence of 'YOUR_ADMIN_UUID' below with your actual admin UUID.

-- ── friends: only the admin can insert/update/delete ──
create policy "Admin insert friends" on public.friends
  for insert with check (auth.uid() = 'YOUR_ADMIN_UUID');

create policy "Admin update friends" on public.friends
  for update using (auth.uid() = 'YOUR_ADMIN_UUID');

create policy "Admin delete friends" on public.friends
  for delete using (auth.uid() = 'YOUR_ADMIN_UUID');

-- ── blog_posts: only the admin can insert/update/delete ──
create policy "Admin insert blog_posts" on public.blog_posts
  for insert with check (auth.uid() = 'YOUR_ADMIN_UUID');

create policy "Admin update blog_posts" on public.blog_posts
  for update using (auth.uid() = 'YOUR_ADMIN_UUID');

create policy "Admin delete blog_posts" on public.blog_posts
  for delete using (auth.uid() = 'YOUR_ADMIN_UUID');

-- Public read access ("for select using (true)") already exists from your
-- earlier setup — nothing to change there. Visitors can still view the
-- friends list and blog posts, they just can't write to either table.