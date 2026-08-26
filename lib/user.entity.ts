import { Collection, EntityRepositoryType, type EventArgs, type Opt, type Ref, ref } from '@mikro-orm/sqlite';
import {
  BeforeCreate,
  BeforeUpdate,
  Embeddable,
  Embedded,
  Entity,
  OneToMany,
  Property,
} from '@mikro-orm/decorators/legacy';
import { hash, verify } from 'argon2';
import { BaseEntity } from './base.entity';
import { Article } from './article.entity';
import { UserRepository } from './user.repository';

@Embeddable()
export class Social {
  @Property({ type: 'string', nullable: true })
  twitter?: string;

  @Property({ type: 'string', nullable: true })
  facebook?: string;

  @Property({ type: 'string', nullable: true })
  linkedin?: string;
}

export type ISocial = Social;

@Entity({ tableName: 'user', repository: () => UserRepository })
export class User extends BaseEntity {
  [EntityRepositoryType]?: UserRepository;

  @Property({ type: 'string' })
  fullName: string;

  @Property({ type: 'string', unique: true, hidden: true })
  email: string;

  @Property({ type: 'string', hidden: true, lazy: true, ref: true })
  password: Ref<string>;

  @Property({ type: 'text', default: '' })
  bio: string & Opt = '';

  @OneToMany({ entity: () => Article, mappedBy: 'author', hidden: true })
  articles = new Collection<Article>(this);

  @Property({ type: 'string', nullable: true, persist: false })
  token?: string;

  @Embedded({ entity: () => Social, object: true, nullable: true })
  social?: ISocial;

  constructor(fullName: string, email: string, password: string) {
    super();
    this.fullName = fullName;
    this.email = email;
    this.password = ref(password);
  }

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword(args: EventArgs<User>) {
    // hash only if the value changed
    // FIXME cast shouldn't be needed, scalar refs should be unwrapped in the payload
    const password = args.changeSet?.payload.password as string | undefined;

    if (password) {
      this.password = ref(await hash(password));
    }
  }

  async verifyPassword(password: string) {
    const hash = await this.password.loadOrFail();
    return verify(hash, password);
  }
}
