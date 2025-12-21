import {
  MikroORM,
  RequestContext,
  Options,
  EntityManager,
  EntityRepository,
  SchemaGenerator,
  IMigrator,
} from '@mikro-orm/sqlite';
import { User } from '@/lib/user.entity';
import { Comment, CommentSchema } from '@/lib/comment.entity';
import { Article } from '@/lib/article.entity';
import { Tag, TagSchema } from '@/lib/tag.entity';
import { UserRepository } from '@/lib/user.repository';
import { ArticleRepository } from '@/lib/article.repository';
import config from '@/mikro-orm.config';

export interface Services {
  orm: MikroORM;
  schema: SchemaGenerator;
  migrator: IMigrator;
  em: EntityManager;
  comment: EntityRepository<Comment>;
  tag: EntityRepository<Tag>;
  user: UserRepository;
  article: ArticleRepository;
}

let cache: Services;

export async function initORM(options?: Options, migrate = true): Promise<Services> {
  if (cache) {
    return cache;
  }

  // allow overriding config options for testing
  const orm = new MikroORM({
    ...config,
    ...options,
  });

  if (migrate) {
    await orm.migrator.up();
  }

  // save to cache before returning
  return (cache = {
    orm,
    em: orm.em,
    schema: orm.schema,
    migrator: orm.migrator,
    article: orm.em.getRepository(Article),
    comment: orm.em.getRepository(CommentSchema),
    user: orm.em.getRepository(User),
    tag: orm.em.getRepository(TagSchema),
  });
}

export async function withRequestContext<T>(cb: (db: Services) => Promise<T>): Promise<T> {
  const db = await initORM();
  return RequestContext.create(db.em, cb.bind(null, db));
}
