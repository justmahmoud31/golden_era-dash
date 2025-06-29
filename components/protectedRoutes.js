'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Allow the login page without auth
    if (pathname === '/login') {
      setIsLoading(false);
      return;
    }

    const token = Cookies.get('token');

    if (!token) {
      router.push('/login');
    } else {
      try {
        const decoded = jwtDecode(token);

        // Check if token is expired
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          Cookies.remove('token');
          router.push('/login');
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        Cookies.remove('token');
        router.push('/login');
      }
    }
  }, [pathname]);

  if (isLoading) return null; // or return a loading spinner

  return <>{children}</>;
}
