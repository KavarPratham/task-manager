"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import React, { useState } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";

const excludedPaths = ["/sign-in", "/sign-up", "/forgot-password"];

const LayoutWithSidebar = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAuthRoute = excludedPaths.includes(pathname);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user, isSignedIn } = useUser();
  const {openUserProfile} = useClerk();
  
  const avatar = user?.imageUrl || "/default-avatar.png";
  const firstName = user?.firstName || "Guest";

  if (isAuthRoute) return <>{children}</>;

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="lg:hidden flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-3 shadow-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              title="Navbar"
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-800 dark:text-gray-100"
            >
              <FaBars size={20} />
            </button>
            <span className="font-semibold text-lg text-gray-800 dark:text-white">
              My Tasks
            </span>
          </div>

          {/* Right-side profile */}
          <div className="flex items-center gap-2"onClick={()=> isSignedIn && openUserProfile()}>
            {isSignedIn ? (
              <Image
                src={avatar}
                alt="User avatar"
                width={45}
                height={45}
                className="rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-4xl text-gray-400 dark:text-gray-600" />
            )}
            <span className="hidden sm:block text-sm font-medium text-gray-800 dark:text-white">
              {firstName}
            </span>
          </div>
        </div>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default LayoutWithSidebar;
