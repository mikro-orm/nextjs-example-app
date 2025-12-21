'use server';

import { wrap } from '@mikro-orm/core';
import { withRequestContext } from '@/lib/db';
import { User } from '@/lib/user.entity';

export async function createUser(fullName: string, email: string, password: string) {
  return withRequestContext(async db => {
    const user = db.em.create(User, { fullName, email, password });
    await db.em.persist(user).flush();
    return wrap(user).toObject();
  });
}

export async function resetUsers() {
  return withRequestContext(async db => {
    await db.em.qb(User).truncate().execute();
  });
}
