import { defineEntity, type InferEntity, p } from '@mikro-orm/sqlite';
import { Article } from './article.entity';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';

export const CommentSchema = defineEntity({
  name: 'Comment',
  extends: BaseEntity,
  properties: {
    text: p.string(),
    article: () => p.manyToOne(Article).ref(),
    author: () => p.manyToOne(User).ref(),
  },
});

export type Comment = InferEntity<typeof CommentSchema>;
