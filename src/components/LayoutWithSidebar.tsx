"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import React from "react";

const excludedPaths = ["/sign-in", "/sign-up", "/forgot-password"];

const LayoutWithSidebar = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAuthRoute = excludedPaths.includes(pathname);

  if (isAuthRoute) {
    return <>{children}</>; // Just render page content
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950">
      <Sidebar />
      <main className="flex-grow overflow-auto bg-gray-900">{children}</main>
    </div>
  );
};

export default LayoutWithSidebar;
