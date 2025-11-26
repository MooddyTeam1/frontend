import React from "react";

interface ContainerProps extends React.PropsWithChildren {
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className = "" }) => (
  <div className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);
