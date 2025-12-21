'use client';

import { useRouter } from 'next/navigation';
import { resetUsers } from '@/app/actions/userActions';

export default function ResetUsersButton() {
  const router = useRouter();

  const handleClick = async () => {
    await resetUsers();
    console.log('Reset all users');
    router.refresh();
  };

  return (
    <button onClick={handleClick} className="h-12 rounded-full bg-foreground px-5 text-background transition-colors">
      Reset Users
    </button>
  );
}
