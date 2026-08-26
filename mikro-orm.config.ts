import { defineConfig } from '@mikro-orm/sqlite';
import { Migrator } from '@mikro-orm/migrations';
import { Social, User } from './lib/user.entity';
import { Article } from './lib/article.entity';
import { ArticleListing } from './lib/article-listing.entity';
import { Tag } from './lib/tag.entity';
import { Comment } from './lib/comment.entity';
import { Migration20251221173216 } from '@/migrations/Migration20251221173216';

export default defineConfig({
  dbName: 'sqlite.db',
  entities: [User, Article, ArticleListing, Tag, Social, Comment],
  debug: true,
  extensions: [Migrator],
  migrations: {
    migrationsList: [Migration20251221173216],
  },
});
