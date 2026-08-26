import { MikroORM, RequestContext } from '@mikro-orm/sqlite';
import { wrap } from '@mikro-orm/core';
import { User, Social } from '@/lib/user.entity';
import { Article } from '@/lib/article.entity';
import { ArticleListing } from '@/lib/article-listing.entity';
import { Tag } from '@/lib/tag.entity';
import { Comment } from '@/lib/comment.entity';

let orm: MikroORM;

beforeAll(async () => {
  orm = new MikroORM({
    dbName: ':memory:',
    entities: [User, Article, ArticleListing, Tag, Social, Comment],
  });

  await orm.schema.drop();
  await orm.schema.create();
});

afterAll(async () => {
  await orm.close(true);
});

describe('server action logic', () => {
  test('create user and serialize', async () => {
    // replicate what the createUser action does
    await RequestContext.create(orm.em, async () => {
      const em = orm.em;
      const user = em.create(User, {
        fullName: 'Action User',
        email: 'action@example.com',
        password: 'secret',
      });
      await em.flush();

      const serialized = wrap(user).toObject();
      expect(serialized).toHaveProperty('fullName', 'Action User');
      expect(serialized).toHaveProperty('bio', '');
      // email and password are hidden, should not appear in toObject
      expect(serialized).not.toHaveProperty('email');
      expect(serialized).not.toHaveProperty('password');
    });
  });

  test('truncate users', async () => {
    // first ensure we have a user
    const em = orm.em.fork();
    const count = await em.count(User);
    expect(count).toBeGreaterThan(0);

    // replicate what resetUsers does
    await em.qb(User).truncate().execute();

    const countAfter = await orm.em.fork().count(User);
    expect(countAfter).toBe(0);
  });
});
