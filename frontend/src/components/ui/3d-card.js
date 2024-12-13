"use client";
import React, { createContext, useContext, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const MouseEnterContext = createContext(null);

export const CardContainer = ({ children, className, containerClassName }) => {
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <motion.div
        onMouseEnter={() => setIsMouseEntered(true)}
        onMouseLeave={() => setIsMouseEntered(false)}
        className={cn("relative", containerClassName)}
      >
        <div className={cn("group/card", className)}>{children}</div>
      </motion.div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = ({ children, className }) => {
  const [isMouseEntered] = useContext(MouseEnterContext);

  return (
    <div className={className}>
      <motion.div
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX: isMouseEntered ? -5 : 0,
          rotateY: isMouseEntered ? 5 : 0,
        }}
        className={cn("relative z-20")}
      >
        {children}
      </motion.div>
    </div>
  );
};

export const CardItem = ({
  as: Component = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
}) => {
  const [isMouseEntered] = useContext(MouseEnterContext);

  return (
    <Component className={cn("", className)}>
      <motion.div
        animate={{
          translateX: isMouseEntered ? translateX : 0,
          translateY: isMouseEntered ? translateY : 0,
          rotateX: isMouseEntered ? rotateX : 0,
          rotateY: isMouseEntered ? rotateY : 0,
          rotateZ: isMouseEntered ? rotateZ : 0,
        }}
      >
        {children}
      </motion.div>
    </Component>
  );
};

