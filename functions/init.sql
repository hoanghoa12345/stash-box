-- Table Definition
CREATE TABLE "public"."collections" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "user_id" uuid NOT NULL,
    "name" text NOT NULL,
    "created_at" timestamptz DEFAULT now(),
    "parent_id" uuid,
    "icon" varchar,
    "updated_at" timestamptz DEFAULT now(),
    "deleted_at" timestamptz,
    CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id"),
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."posts" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "user_id" uuid NOT NULL,
    "title" text NOT NULL,
    "content" text,
    "image_url" text,
    "link" text,
    "collection_id" uuid,
    "created_at" timestamptz DEFAULT now(),
    "updated_at" timestamptz DEFAULT now(),
    "type" int2 NOT NULL DEFAULT 1,
    "order" int4 NOT NULL DEFAULT 0,
    "deleted_at" timestamptz,
    CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id"),
    CONSTRAINT "bookmarks_category_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id"),
    PRIMARY KEY ("id")
);