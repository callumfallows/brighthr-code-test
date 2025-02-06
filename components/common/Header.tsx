"use client";

import Logo from "./Logo";

export default function Header() {
  return (
    <header className="relative w-full h-20 container mx-auto">
      <nav className="fixed flex items-center p-4 w-full top-0 bg-white">
        <Logo />
      </nav>
    </header>
  );
}
