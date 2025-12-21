import Image from 'next/image';
import { withRequestContext } from '@/lib/db';
import AddUserButton from '@/app/AddUserButton';
import Paginator from '@/app/Paginator';
import ResetUsersButton from '@/app/ResetUsersButton';

export default async function Home({ searchParams }: { searchParams: Promise<{ before?: string; after?: string }> }) {
  return withRequestContext(async db => {
    const params = await searchParams;
    const cursor = params.before ? { last: 5, before: params.before } : { first: 5, after: params.after };
    const users = await db.user.findByCursor({
      ...cursor,
      orderBy: { id: 'asc' },
    });

    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
          <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={100} height={20} priority />
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              There {users.totalCount === 1 ? 'is 1 user' : `are ${users.totalCount} users`} in the database
              {users.totalCount === 0 ? '.' : ':'}
            </h1>

            <div className="overflow-x-auto min-w-160">
              <table className="min-w-full border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                <thead className="bg-zinc-50 dark:bg-zinc-900">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300">ID</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Created at
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300">Name</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Email
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {users.items.map(user => (
                    <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
                      <td className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400">{user.id}</td>
                      <td className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {user.createdAt.toISOString()}
                      </td>
                      <td className="px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {user.fullName}
                      </td>
                      <td className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400">{user.email}</td>
                    </tr>
                  ))}
                  {users.items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-2 text-sm text-center">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Paginator
              before={users.startCursor}
              after={users.endCursor}
              total={users.totalCount}
              hasNextPage={users.hasNextPage}
              hasPrevPage={users.hasPrevPage}
            />

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <AddUserButton />
              <ResetUsersButton />
            </div>
          </div>
        </main>
      </div>
    );
  });
}
