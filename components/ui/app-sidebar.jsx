'use client';

import {
  Home,
  Boxes,
  LayoutList,
  ShoppingCart,
  Users,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const items = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Products', url: '/products', icon: Boxes },
  { title: 'Categories', url: '/categories', icon: LayoutList },
  { title: 'Orders', url: '/orders', icon: ShoppingCart },
  { title: 'Users', url: '/users', icon: Users },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/login');
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="flex flex-col justify-between my-12 h-full">
        <div>
          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className={isActive ? 'bg-neon-gold text-white font-semibold rounded-md' : ''}>
                        <Link href={item.url} className="flex items-center gap-3">
                          <item.icon className="h-6 w-6" />
                          <span className="text-lg">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <div className="mb-16 p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut className="h-8 w-8 text-red-600" />
                <span className="text-lg text-red-600 cursor-pointer font-medium">Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
