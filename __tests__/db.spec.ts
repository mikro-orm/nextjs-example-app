import { MikroORM } from '@mikro-orm/sqlite';
import { User, UserSchema, Social } from '@/lib/user.entity';
import { Article, ArticleSchema } from '@/lib/article.entity';
import { ArticleListingSchema } from '@/lib/article-listing.entity';
import { TagSchema } from '@/lib/tag.entity';
import { CommentSchema } from '@/lib/comment.entity';

let orm: MikroORM;

beforeAll(async () => {
  orm = new MikroORM({
    dbName: ':memory:',
    entities: [UserSchema, ArticleSchema, ArticleListingSchema, TagSchema, Social, CommentSchema],
  });

  await orm.schema.drop();
  await orm.schema.create();
});

afterAll(async () => {
  await orm.close(true);
});

describe('User entity', () => {
  test('create a user', async () => {
    const em = orm.em.fork();
    const user = em.create(User, {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'secret123',
    });
    await em.flush();

    expect(user.id).toBeDefined();
    expect(user.fullName).toBe('John Doe');
    expect(user.bio).toBe('');
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  test('password is hashed on create', async () => {
    const em = orm.em.fork();
    const user = await em.findOneOrFail(User, { email: 'john@example.com' }, { populate: ['password'] });
    const password = await user.password.load();
    // argon2 hashes start with $argon2
    expect(password).toMatch(/^\$argon2/);
  });

  test('verify password', async () => {
    const em = orm.em.fork();
    const user = await em.findOneOrFail(User, { email: 'john@example.com' }, { populate: ['password'] });
    expect(await user.verifyPassword('secret123')).toBe(true);
    expect(await user.verifyPassword('wrongpassword')).toBe(false);
  });

  test('unique email constraint', async () => {
    const em = orm.em.fork();
    em.create(User, {
      fullName: 'Jane Doe',
      email: 'john@example.com', // duplicate
      password: 'password',
    });
    await expect(em.flush()).rejects.toThrow();
  });

  test('user repository exists method', async () => {
    const em = orm.em.fork();
    const repo = em.getRepository(User);
    expect(await repo.exists('john@example.com')).toBe(true);
    expect(await repo.exists('nonexistent@example.com')).toBe(false);
  });

  test('user repository login method', async () => {
    const em = orm.em.fork();
    const repo = em.getRepository(User);
    const user = await repo.login('john@example.com', 'secret123');
    expect(user.fullName).toBe('John Doe');
  });

  test('user repository login with wrong password', async () => {
    const em = orm.em.fork();
    const repo = em.getRepository(User);
    await expect(repo.login('john@example.com', 'wrong')).rejects.toThrow('Invalid combination of email and password');
  });
});

describe('Article entity', () => {
  test('create an article with author', async () => {
    const em = orm.em.fork();
    const author = await em.findOneOrFail(User, { email: 'john@example.com' });
    const article = em.create(Article, {
      author,
      title: 'My First Article',
      description: 'A test article',
      text: 'Hello world content',
    });
    await em.flush();

    expect(article.id).toBeDefined();
    expect(article.slug).toBe('my-first-article');
    expect(article.title).toBe('My First Article');
    expect(article.description).toBe('A test article');
    expect(article.author.id).toBe(author.id);
  });

  test('article slug is generated from title', async () => {
    const em = orm.em.fork();
    const author = await em.findOneOrFail(User, { email: 'john@example.com' });
    const article = em.create(Article, {
      author,
      title: 'Hello World!!! Test & Check',
      description: 'desc',
      text: 'text',
    });
    await em.flush();

    expect(article.slug).toBe('hello-world-test-check');
  });

  test('article text is lazy loaded', async () => {
    const em = orm.em.fork();
    const article = await em.findOneOrFail(Article, { slug: 'my-first-article' });
    // text is a lazy Ref, not loaded by default
    expect(article.text.isInitialized()).toBe(false);

    const text = await article.text.load();
    expect(text).toBe('Hello world content');
  });
});

describe('Tag entity', () => {
  test('create tags and assign to article', async () => {
    const em = orm.em.fork();
    const article = await em.findOneOrFail(Article, { slug: 'my-first-article' }, { populate: ['tags'] });

    const tag1 = em.create(TagSchema, { name: 'typescript' });
    const tag2 = em.create(TagSchema, { name: 'orm' });
    article.tags.add(tag1, tag2);
    await em.flush();

    expect(tag1.id).toBeDefined();
    expect(tag2.id).toBeDefined();
    expect(article.tags).toHaveLength(2);
  });

  test('tags are persisted via many-to-many', async () => {
    const em = orm.em.fork();
    const article = await em.findOneOrFail(Article, { slug: 'my-first-article' }, { populate: ['tags'] });
    expect(article.tags).toHaveLength(2);
    const tagNames = article.tags.getItems().map(t => t.name);
    expect(tagNames).toContain('typescript');
    expect(tagNames).toContain('orm');
  });
});

describe('Comment entity', () => {
  test('create a comment on an article', async () => {
    const em = orm.em.fork();
    const author = await em.findOneOrFail(User, { email: 'john@example.com' });
    const article = await em.findOneOrFail(Article, { slug: 'my-first-article' });

    const comment = em.create(CommentSchema, {
      text: 'Great article!',
      article,
      author,
    });
    await em.flush();

    expect(comment.id).toBeDefined();
    expect(comment.text).toBe('Great article!');
  });

  test('comments are eagerly loaded with article', async () => {
    const em = orm.em.fork();
    const article = await em.findOneOrFail(Article, { slug: 'my-first-article' });
    // comments are defined as eager in ArticleSchema
    expect(article.comments).toHaveLength(1);
    expect(article.comments[0].text).toBe('Great article!');
  });

  test('orphan removal deletes comments when removed from collection', async () => {
    const em = orm.em.fork();
    const article = await em.findOneOrFail(Article, { slug: 'my-first-article' });
    expect(article.comments).toHaveLength(1);

    article.comments.removeAll();
    await em.flush();

    const comments = await em.fork().find(CommentSchema, { article });
    expect(comments).toHaveLength(0);
  });
});

describe('ArticleListing virtual entity', () => {
  test('list articles via repository', async () => {
    const em = orm.em.fork();
    const repo = em.getRepository(Article);
    const { items, total } = await repo.listArticles({});

    expect(total).toBeGreaterThanOrEqual(1);
    expect(items[0]).toHaveProperty('slug');
    expect(items[0]).toHaveProperty('title');
    expect(items[0]).toHaveProperty('authorName');
  });
});
