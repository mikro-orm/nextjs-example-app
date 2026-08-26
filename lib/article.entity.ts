import { Collection, EntityRepositoryType, ref, type Ref, type Rel, type Opt } from '@mikro-orm/sqlite';
import { Entity, ManyToMany, ManyToOne, OneToMany, Property } from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { Tag } from './tag.entity';
import { ArticleRepository } from './article.repository';

function convertToSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

@Entity({ tableName: 'article', repository: () => ArticleRepository })
export class Article extends BaseEntity {
  [EntityRepositoryType]?: ArticleRepository;

  @Property({ type: 'string', unique: true })
  slug: string & Opt;

  @Property({ type: 'string', index: true })
  title: string;

  @Property({ type: 'string', length: 1000 })
  description: string;

  @Property({ type: 'text', lazy: true, ref: true })
  text: Ref<string>;

  @ManyToMany({ entity: () => Tag, pivotTable: 'article_tags' })
  tags = new Collection<Tag>(this);

  @ManyToOne({ entity: () => User, ref: true })
  author: Ref<User>;

  @OneToMany({ entity: () => Comment, mappedBy: 'article', eager: true, orphanRemoval: true })
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
