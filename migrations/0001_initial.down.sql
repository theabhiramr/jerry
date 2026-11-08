-- I use this pattern coming from sqlx with rust
-- I may want to not do this since I am not planning on building a full migration system...

DROP TABLE IF EXISTS comments;
DROP INDEX IF EXISTS pages_slug_key;
DROP TABLE IF EXISTS pages;
DROP TABLE IF EXISTS site_members;
DROP TABLE IF EXISTS sites;
DROP TABLE IF EXISTS users;
