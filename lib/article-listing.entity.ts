import { defineEntity, p, EntityManager, type InferEntity } from '@mikro-orm/sqlite';
import { Article } from './article.entity';

export const ArticleListingSchema = defineEntity({
  name: 'ArticleListing',
  expression: (em: EntityManager) => {
    return em.getRepository(Article).listArticlesQuery();
  },
  properties: {
    slug: p.string(),
    title: p.string(),
    description: p.string(),
    tags: p.array(),
    author: p.integer(),
    authorName: p.string(),
    totalComments: p.integer(),
  },
});

export type ArticleListing = InferEntity<typeof ArticleListingSchema>;
