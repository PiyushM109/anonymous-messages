"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a
          className="flex flex-row text-xl font-bold mb-4 md:mb-0 gap-4"
          href="#"
        >
          <Image src="/globe.svg" width={30} height={30} alt="logo" />
          Anonymous Message
        </a>
        {session ? (
          <>
            <span className="mr-4">
              Welcome, {user?.username || user?.email}
            </span>
            <ThemeToggle />
            <Button className="w-full md:w-auto" onClick={() => signOut()}>
              Logout
            </Button>
          </>
        ) : (
          <div className="flex items-center">
            <ThemeToggle />
            <Link href="/sign-in">
              <Button className="w-full mx-4 md:w-auto">Login</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
