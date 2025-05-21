"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import {
  FaTasks,
  FaCheckCircle,
  FaStar,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";

const navLinks = [
  { label: "All Tasks", href: "/dashboard", icon: <FaTasks /> },
  { label: "Completed", href: "/completed", icon: <FaCheckCircle /> },
  { label: "Important", href: "/important", icon: <FaStar /> },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut, openUserProfile } = useClerk();
  const { user } = useUser();

  const { firstName, lastName, imageUrl } = user || {
    firstName: "",
    lastName: "",
    imageUrl: "/default-avatar.png",
  };

  return (
    <div
      className="
        h-screen w-64 
        bg-white border-r border-gray-200 
        dark:bg-gray-900 dark:border-gray-700 
        flex flex-col justify-between p-4 shadow-sm
      "
    >
      {/* Top Section */}
      <div>
        <div
          className="flex items-center justify-between p-2 gap-4 hover:bg-gray-800 hover:border-gray-400 rounded-2xl transition-all cursor-pointer mb-8"
          onClick={()=>openUserProfile()}
        >
          {/* Left: Avatar + Name */}
          <div className="flex items-center gap-4">
            <Image
              src={imageUrl}
              alt="User"
              width={60}
              height={60}
              className="rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-base text-gray-900 dark:text-gray-100">
                {firstName}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {lastName}
              </span>
            </div>
          </div>

          {/* Right: Settings Icon */}
          <FaCog className="text-gray-500 dark:text-gray-400 text-xl" />
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navLinks.map(({ label, href, icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-md transition-colors
                  text-sm font-medium
                  ${
                    isActive
                      ? "bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400 border-l-4 border-blue-600"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                <span className="text-lg">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sign out */}
      <button
        className="
          flex items-center justify-center gap-2 mt-8 px-4 py-2 
          bg-red-500 text-white rounded 
          hover:bg-red-600 
          dark:bg-red-600 dark:hover:bg-red-700
        "
        onClick={() => signOut(() => router.push("/sign-in"))}
      >
        <FaSignOutAlt />
        Sign Out
      </button>
    </div>
  );
};

export default Sidebar;
