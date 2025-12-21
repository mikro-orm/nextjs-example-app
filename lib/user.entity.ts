import {
  Collection,
  defineEntity,
  p,
  EntityRepositoryType,
  type EventArgs,
  type Opt,
  type InferEntity,
  Ref,
  ref,
} from '@mikro-orm/sqlite';
import { hash, verify } from 'argon2';
import { BaseEntity, BaseProperties } from './base.entity';
import { Article } from './article.entity';
import { UserRepository } from './user.repository';

export const Social = defineEntity({
  name: 'Social',
  embeddable: true,
  properties: {
    twitter: p.string().nullable(),
    facebook: p.string().nullable(),
    linkedin: p.string().nullable(),
  },
});

export type ISocial = InferEntity<typeof Social>;

export class User extends BaseEntity {
  [EntityRepositoryType]?: UserRepository;
  fullName: string;
  email: string;
  password: Ref<string>;
  bio: string & Opt = '';
  articles = new Collection<Article>(this);
  token?: string;
  social?: ISocial;

  constructor(fullName: string, email: string, password: string) {
    super();
    this.fullName = fullName;
    this.email = email;
    this.password = ref(password);
  }

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

export const UserSchema = defineEntity({
  class: User,
  tableName: 'user',
  repository: () => UserRepository,
  extends: BaseEntity,
  properties: {
    ...BaseProperties,
    fullName: p.string(),
    email: p.string().unique().hidden(),
    password: p.string().hidden().lazy(),
    bio: p.text().default(''),
    articles: () => p.oneToMany(Article).mappedBy('author').hidden(),
    token: p.string().nullable().persist(false),
    social: () => p.embedded(Social).object(true).nullable(),
  },
  hooks: {
    beforeCreate: ['hashPassword'],
    beforeUpdate: ['hashPassword'],
  },
});
