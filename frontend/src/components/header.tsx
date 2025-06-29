"use client";

import Logo from "@/components/logo";
import { authClient } from "@/lib/auth-client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function Header() {
  const session = authClient.useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  return (
    <header className="fixed top-6 z-50 mx-auto flex w-full items-center justify-between">
      <nav className="mx-2 flex h-12 w-full max-w-[600px] items-center justify-between rounded-full bg-black pl-3 pr-1 text-white sm:mx-auto">
        <Link href="/#" passHref>
          <Logo className="h-6 text-white" />
        </Link>
        <div className="hidden gap-x-6 sm:flex">
          <Link href="/about" className="text-zinc-300 hover:text-white">
            About
          </Link>
          <Link href="/#features" className="text-zinc-300 hover:text-white">
            Features
          </Link>
          <Link href="/about" className="text-zinc-300 hover:text-white">
            Contact
          </Link>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black p-2 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => {
            setTheme(theme === "dark" ? "light" : "dark");
          }}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5 text-zinc-400" />
          )}
        </Button>

        <Button
          onClick={() => {
            router.push(session ? "/dashboard" : "/login");
          }}
          className="rounded-full bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {session.data?.user ? "Dashboard" : "Sign In"}
        </Button>
      </nav>
    </header>
  );
}
