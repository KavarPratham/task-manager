"use client";

import {
  SiNextdotjs,
  SiPrisma,
  SiMongodb,
  SiTailwindcss,
  SiVercel,
  SiReact,
  SiClerk,
} from "react-icons/si";
import { FaTools, FaGraduationCap, FaRocket } from "react-icons/fa";
import { motion } from "framer-motion";
import React from "react";

const AboutPage = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-900 dark:text-gray-100">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-10 text-center"
      >
        🚀 About This Project
      </motion.h1>

      <FadeInSection delay={0.1}>
        <SectionCard title="Tech Stack Used" icon={<FaTools />}>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 text-center text-sm">
            <TechItem icon={<SiNextdotjs size={36} />} label="Next.js" />
            <TechItem icon={<SiReact size={36} className="text-sky-400" />} label="React" />
            <TechItem icon={<SiTailwindcss size={36} className="text-sky-500" />} label="Tailwind" />
            <TechItem icon={<SiClerk size={36} className="text-indigo-500" />} label="Clerk Auth" />
            <TechItem icon={<SiPrisma size={36} className="text-purple-600" />} label="Prisma" />
            <TechItem icon={<SiMongodb size={36} className="text-green-600" />} label="MongoDB" />
            <TechItem icon={<SiVercel size={36} />} label="Vercel" />
          </div>
        </SectionCard>
      </FadeInSection>

      <FadeInSection delay={0.2}>
        <SectionCard title="Key Features" icon="⚙️">
          <ul className="list-disc list-inside space-y-2 text-base">
            <li>🔐 Secure auth using Clerk with sign-in, sign-up, and protected routes</li>
            <li>🧾 Task Manager with add/edit/delete functionality</li>
            <li>🌗 Responsive layout with mobile sidebar & dark mode</li>
            <li>📦 Backend with Prisma + MongoDB for full CRUD support</li>
            <li>
              🚀 Deployed live on{" "}
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener"
                className="underline text-blue-500"
              >
                Vercel
              </a>
            </li>
          </ul>
        </SectionCard>
      </FadeInSection>

      <FadeInSection delay={0.3}>
        <SectionCard title="What I Learned" icon={<FaGraduationCap />}>
          <ul className="list-disc list-inside space-y-2 text-base">
            <li>🔧 How to use Prisma for seamless MongoDB integration</li>
            <li>⚛️ Modular component architecture and clean UI with Tailwind</li>
            <li>🧠 Improved Next.js 13+ routing and app structure understanding</li>
            <li>🔒 Secure and role-aware routes using Clerk’s API</li>
          </ul>
        </SectionCard>
      </FadeInSection>

      <FadeInSection delay={0.4}>
        <SectionCard title="Deployment & Hosting" icon={<FaRocket />}>
          <p className="text-base">
            This project is live and hosted using <strong>Vercel</strong>. The integration between the
            frontend, backend (API routes), and database is smooth, fast, and optimized for production.
          </p>
        </SectionCard>
      </FadeInSection>
    </div>
  );
};

// Card Wrapper
const SectionCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="mb-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
    <h2 className="text-2xl font-semibold flex items-center gap-3 mb-4 text-blue-600 dark:text-blue-400">
      {icon} {title}
    </h2>
    {children}
  </div>
);

// Fade In Wrapper using Framer Motion
const FadeInSection = ({
  children,
  delay = 0.1,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
  >
    {children}
  </motion.div>
);

// Reusable Tech Item
const TechItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex flex-col items-center gap-1 text-gray-800 dark:text-gray-100">
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);

export default AboutPage;
