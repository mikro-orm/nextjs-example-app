'use client';

import { useRouter, useSearchParams } from 'next/navigation';

type Props = {
  before: string | null;
  after: string | null;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export default function Paginator({ before, after, total, hasPrevPage, hasNextPage }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goNext = () => {
    if (!hasNextPage || !after) return;
    const params = new URLSearchParams(searchParams);
    params.delete('before');
    params.set('after', after);
    router.push(`?${params.toString()}`);
  };

  const goPrev = () => {
    if (!hasPrevPage || !before) return;
    const params = new URLSearchParams(searchParams);
    params.delete('after');
    params.set('before', before);
    router.push(`?${params.toString()}`);
  };

  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
      <button
        onClick={goPrev}
        disabled={!hasPrevPage}
        className="flex h-6 items-center justify-center gap-2 rounded-full bg-foreground px-3 text-background transition-colors"
      >
        Prev
      </button>
      <button
        onClick={goNext}
        disabled={!hasNextPage}
        className="flex h-6 items-center justify-center gap-2 rounded-full bg-foreground px-3 text-background transition-colors"
      >
        Next
      </button>
      ({total} item{total === 1 ? '' : 's'})
    </div>
  );
}
