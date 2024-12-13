import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export const HeroHighlight = ({ children, className }) => {
  return (
    <span
      className={cn(
        "font-bold bg-slate-900 text-slate-200 rounded-full px-1 py-0.5",
        className
      )}
    >
      {children}
    </span>
  );
};

export const Highlight = ({ children, className }) => {
  return (
    <span
      className={cn(
        "font-bold bg-slate-200 text-slate-900 rounded-full px-1 py-0.5",
        className
      )}
    >
      {children}
    </span>
  );
};

