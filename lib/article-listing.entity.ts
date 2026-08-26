import { type EntityManager } from '@mikro-orm/sqlite';
import { Entity, Property } from '@mikro-orm/decorators/legacy';
import { Article } from './article.entity';

@Entity({
  tableName: 'article_listing',
  expression: (em: EntityManager) => {
    return em.getRepository(Article).listArticlesQuery();
  },
})
export class ArticleListing {
  @Property({ type: 'string' })
  slug!: string;

  @Property({ type: 'string' })
  title!: string;

  @Property({ type: 'string' })
  description!: string;

  @Property({ type: 'string[]' })
  tags!: string[];

  @Property({ type: 'integer' })
  author!: number;

  @Property({ type: 'string' })
  authorName!: string;

  @Property({ type: 'integer' })
  totalComments!: number;
}
