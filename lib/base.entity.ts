import { p, defineEntity, Opt, PrimaryKeyProp } from '@mikro-orm/sqlite';

export const BaseProperties = {
  id: p.integer().primary(),
  createdAt: p.datetime().onCreate(() => new Date()),
  updatedAt: p
    .datetime()
    .onCreate(() => new Date())
    .onUpdate(() => new Date()),
};

export abstract class BaseEntity {
  [PrimaryKeyProp]?: 'id';
  id!: number;
  createdAt: Date & Opt = new Date();
  updatedAt: Date & Opt = new Date();
}

export const BaseSchema = defineEntity({
  class: BaseEntity,
  name: 'BaseEntity',
  properties: BaseProperties,
});
