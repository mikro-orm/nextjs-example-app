import { Collection } from '@mikro-orm/sqlite';
import { Entity, ManyToMany, Property } from '@mikro-orm/decorators/legacy';
import { Article } from './article.entity';
import { BaseEntity } from './base.entity';

@Entity({ tableName: 'tag' })
export class Tag extends BaseEntity {
  @Property({ type: 'string', length: 20 })
  name!: string;

  @ManyToMany({ entity: () => Article, mappedBy: 'tags' })
  articles = new Collection<Article>(this);
}
