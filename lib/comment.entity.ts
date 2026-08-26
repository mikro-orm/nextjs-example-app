import { type Ref } from '@mikro-orm/sqlite';
import { Entity, ManyToOne, Property } from '@mikro-orm/decorators/legacy';
import { Article } from './article.entity';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity({ tableName: 'comment' })
export class Comment extends BaseEntity {
  @Property({ type: 'string' })
  text!: string;

  @ManyToOne({ entity: () => Article, ref: true })
  article!: Ref<Article>;

  @ManyToOne({ entity: () => User, ref: true })
  author!: Ref<User>;
}
