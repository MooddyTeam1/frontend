import React from "react";
import { Container } from "../Container";

export const Footer: React.FC = () => (
  <footer className="border-t border-neutral-200 py-12 text-sm text-neutral-500">
    <Container>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} MOA</span>
        <div className="flex flex-wrap items-center gap-4">
          <a href="#" className="hover:text-neutral-900">
            이용약관
          </a>
          <a href="#" className="hover:text-neutral-900">
            개인정보처리방침
          </a>
          <a href="mailto:hello@fundit.app" className="hover:text-neutral-900">
            hello@fundit.app
          </a>
        </div>
      </div>
    </Container>
  </footer>
);
