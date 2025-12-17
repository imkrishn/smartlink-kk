"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function ClientTransitionWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ y: -200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 200, opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
