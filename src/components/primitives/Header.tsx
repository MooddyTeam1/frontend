import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "./Container";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/projects?search=${encodeURIComponent(query)}` : "/projects");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <Container>
        <div className="flex items-center gap-6 py-4">
          <Link to="/" className="text-base font-semibold tracking-tight text-neutral-900">
            FUND<span className="text-neutral-400">IT</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-neutral-600 md:flex">
            <Link to="/projects" className="hover:text-neutral-900">
              Projects
            </Link>
            <Link to="/projects?sort=ending_soon" className="hover:text-neutral-900">
              Ending Soon
            </Link>
            <Link to="/creator/projects/new" className="hover:text-neutral-900">
              Start a Project
            </Link>
          </nav>
          <Link
            to="/projects"
            className="ml-auto text-sm text-neutral-600 hover:text-neutral-900 md:hidden"
          >
            탐색
          </Link>
          <form
            onSubmit={handleSubmit}
            className="ml-auto hidden items-center gap-2 rounded-full border border-neutral-200 px-4 py-1.5 text-sm text-neutral-600 sm:flex"
          >
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects"
              className="w-40 bg-transparent placeholder:text-neutral-400"
            />
            <button type="submit" className="text-neutral-500 hover:text-neutral-900">
              검색
            </button>
          </form>
          <Link
            to="/login"
            className="hidden text-sm text-neutral-600 hover:text-neutral-900 md:inline-flex"
          >
            로그인
          </Link>
          <Link
            to="/creator/projects/new"
            className="rounded-full border border-neutral-900 px-3 py-1.5 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white"
          >
            프로젝트 만들기
          </Link>
        </div>
      </Container>
    </header>
  );
};
