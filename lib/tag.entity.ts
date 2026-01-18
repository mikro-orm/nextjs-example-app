import { defineEntity, type InferEntity, p } from '@mikro-orm/sqlite';
import { Article } from './article.entity';
import { BaseEntity } from './base.entity';

export const TagSchema = defineEntity({
  name: 'Tag',
  extends: BaseEntity,
  properties: {
    name: p.string().length(20),
    articles: () => p.manyToMany(Article).mappedBy('tags'),
  },
});

export type Tag = InferEntity<typeof TagSchema> & BaseEntity;
