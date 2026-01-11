"use client";

import React, { type ReactNode } from "react";
import { cn } from "@/utils/helpers";

interface EditorWrapperProps {
  children: ReactNode;
  error?: boolean;
  className?: string;
}

export const EditorWrapper: React.FC<EditorWrapperProps> = ({
  children,
  error = false,
  className,
}) => {
  return (
    <div
      className={cn(
        "w-full min-h-[300px] h-fit border border-solid rounded-lg",
        error ? "border-red-500" : "border-N40",
        "flex flex-col [&>div]:flex-1 [&>div]:overflow-y-auto [&>div]:h-full",
        "[&>div]:p-5", // editor content padding
        className
      )}
    >
      {children}
    </div>
  );
};
