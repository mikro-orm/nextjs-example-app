import {
  Collection,
  defineEntity,
  p,
  EntityRepositoryType,
  ref,
  type Ref,
  type Rel,
  type Opt,
} from '@mikro-orm/sqlite';
import { BaseEntity, BaseProperties } from './base.entity';
import { User } from './user.entity';
import { type Comment, CommentSchema } from './comment.entity';
import { type Tag, TagSchema } from './tag.entity';
import { ArticleRepository } from './article.repository';

function convertToSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export class Article extends BaseEntity {
  [EntityRepositoryType]?: ArticleRepository;
  slug: string & Opt;
  title: string;
  description: string;
  text: Ref<string>;
  tags = new Collection<Tag>(this);
  author: Ref<User>;
  comments = new Collection<Comment>(this);

  constructor(author: Rel<User>, title: string, description = '', text = '') {
    super();
    this.author = ref(author);
    this.title = title;
    this.description = description;
    this.text = ref(text);
    this.slug = convertToSlug(title);
  }
}

export const ArticleSchema = defineEntity({
  class: Article,
  tableName: 'article',
  repository: () => ArticleRepository,
  constructorParams: ['author', 'title', 'description', 'text'],
  properties: {
    ...BaseProperties,
    slug: p.string().unique(),
    title: p.string().index(),
    description: p.string().length(1000),
    text: p.text().lazy(),
    tags: () => p.manyToMany(TagSchema),
    author: () => p.manyToOne(User).ref(),
    comments: () => p.oneToMany(CommentSchema).mappedBy('article').eager().orphanRemoval(),
  },
});
