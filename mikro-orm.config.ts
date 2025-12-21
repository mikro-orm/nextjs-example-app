import { defineConfig } from '@mikro-orm/sqlite';
import { Migrator } from '@mikro-orm/migrations';
import { Social, UserSchema } from './lib/user.entity';
import { ArticleSchema } from './lib/article.entity';
import { ArticleListingSchema } from './lib/article-listing.entity';
import { TagSchema } from './lib/tag.entity';
import { CommentSchema } from './lib/comment.entity';
import { Migration20251221173216 } from '@/migrations/Migration20251221173216';

export default defineConfig({
  dbName: 'sqlite.db',
  entities: [UserSchema, ArticleSchema, ArticleListingSchema, TagSchema, Social, CommentSchema],
  debug: true,
  extensions: [Migrator],
  migrations: {
    migrationsList: [Migration20251221173216],
  },
});
