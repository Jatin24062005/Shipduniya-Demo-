'use client';

import React from 'react';
import PropTypes from 'prop-types';
import { LogOut, X } from 'lucide-react';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

const Sidebar = ({ sidebarOpen, toggleSidebar, navItems }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab by checking if the current pathname starts with the nav item URL.
  const activeTab = navItems.find((item) => pathname.startsWith(item.url))?.name;

  return (
    <aside
      className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } min-h-[87.5vh] fixed inset-y-0 left-0 z-50 w-46 bg-gray-800 text-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between bg-gray-800">
          
          <button onClick={toggleSidebar} className="lg:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-grow mt-[10%] gap-3 px-4">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant={activeTab === item.name ? "secondary" : "ghost"}
              className={`flex w-full justify-start p-4 mb-2 text-left hover:bg-gray-700 hover:text-white rounded-xl text-white ${
                activeTab === item.name ? "bg-white text-gray-800 rounded-xl" : ""
              }`}
              onClick={() => {
                router.push(item.url);
                toggleSidebar();
              }}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
