"use client";

import Logo from "./common/Logo";


export default function Header() {
  return (
    <header className="relative w-full h-20">
      <nav className="fixed flex items-center p-4 w-full top-0 bg-white">
        <Logo />
      </nav>
    </header>
  );
}
