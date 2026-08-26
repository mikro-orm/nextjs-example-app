import { type Opt } from '@mikro-orm/sqlite';
import { PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

export abstract class BaseEntity {
  @PrimaryKey({ type: 'integer' })
  id!: number;

  @Property({ type: 'datetime', onCreate: () => new Date() })
  createdAt: Date & Opt = new Date();

  @Property({ type: 'datetime', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date();
}
