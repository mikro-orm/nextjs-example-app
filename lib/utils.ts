import { User } from './user.entity';
import { Article } from './article.entity';

export function verifyArticlePermissions(user: User, article: Article): void {
  if (article.author.id !== user.id) {
    throw new Error('You are not the author of this article!');
  }
}

export class AuthError extends Error {}
