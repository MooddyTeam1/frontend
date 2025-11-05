import React from "react";

export const Container: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
);
