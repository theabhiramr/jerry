CREATE TABLE users (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username    text NOT NULL UNIQUE,
  email       text,
  hash        text NOT NULL, -- for now just creating a password hash
  active      boolean default true,
  created_at  timestampz NOT NULL DEFAULT now()
);

CREATE TABLE sites (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug        text NOT NULL UNIQUE,
  name        text NOT NULL,
  description text NOT NULL DEFAULT '',
  owner_id    integer NOT NULL REFERENCES users (id),
  created_at  timestampz NOT NULL DEFAULT now()
);

CREATE TABLE site_members (
  site_id     integer NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
  user_id     integer NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  role        text NOT NULL CHECK (role IN ('admin', 'editor', 'member')), -- Something I picked up from work is to not use pg enums
  created_at  timestampz NOT NULL DEFAULT now(),
  PRIMARY KEY (site_id, user_id) -- I love composite primary keys 
);

CREATE TABLE pages (
  id                    integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  site_id               integer NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
  title                 text NOT NULL,
  slug                  text NOT NULL,
  current_revision_id   integer,
  meta                  jsonb NOT NULL DEFAULT '{}', -- stuff from the frontmatter
  created_at            timestampz NOT NULL DEFAULT now(),
  updated_at            timestampz NOT NULL DEFAULT now(),
  deleted_at            timestampz -- soft delete for pages
);

CREATE UNIQUE INDEX pages_slug_key ON pages (site_id, slug) WHERE deleted_at IS NULL;
-- probably needs more stuff once we are actually querying

CREATE TABLE revisions (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  page_id     integer NOT NULL REFERENCES pages (id) ON DELETE CASCADE,
  author_id   integer REFERENCES users (id) ON DELETE SET NULL,
  content     text NOT NULL,
  summary     text NOT NULL DEFAULT '',
  created_at  timestampz NOT NULL DEFAULT now(),
);

ALTER TABLE pages ADD CONSTRAINT pages_current_revision_fkey
  FOREIGN KEY (current_revision_id) REFERENCES revisions (id);

CREATE TABLE comments (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  page_id     integer NOT NULL REFERENCES pages (id) ON DELETE CASCADE,
  author_id   integer REFERENCES users (id) ON DELETE SET NULL,
  body        text NOT NULL, --comment length?
  created_at  timestampz NOT NULL DEFAULT now(),
  deleted_at  timestampz, -- soft deletes again
);

-- TODO: indexes
