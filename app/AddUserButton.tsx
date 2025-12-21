'use client';

import { useRouter } from 'next/navigation';
import { createUser } from '@/app/actions/userActions';

export default function AddUserButton() {
  const router = useRouter();

  const handleClick = async () => {
    const user = await createUser(
      'Alice' + Math.random(),
      `alice${Math.random()}@example.com`,
      Math.random().toString(36).slice(-8),
    );
    console.log('Created user', user);
    router.refresh();
  };

  return (
    <button onClick={handleClick} className="h-12 rounded-full bg-foreground px-5 text-background transition-colors">
      Add User
    </button>
  );
}
