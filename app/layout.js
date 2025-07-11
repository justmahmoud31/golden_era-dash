'use client';

import { usePathname } from 'next/navigation';
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Spectral } from 'next/font/google';
import "./globals.css";
import Providers from "./provider";
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from '@/components/protectedRoutes';

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-spectral',
  display: 'swap',
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLogin = pathname === '/login';

  return (
    <html lang="en">
      <body
        className={`${spectral.variable}`}
        style={{ fontFamily: "var(--font-spectral)" }}
      >
        <SidebarProvider>
          {!isLogin && <AppSidebar />}

          <Providers>
            {!isLogin && <SidebarTrigger />}
            <ProtectedRoute>
              <main className="lg:py-8 pr-2 py-6 h-full overflow-auto w-full">
                {children}
              </main>
            </ProtectedRoute>
            <Toaster position="top-center" />
          </Providers>
        </SidebarProvider>
      </body>
    </html>
  );
}
