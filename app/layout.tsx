import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "GSB Core Loop",
  description: "Personal MVP for goals, signals, actions, and relationships."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app">
          <header className="header">
            <div className="brand">GSB Core Loop</div>
            <nav className="nav">
              <Link href="/">Dashboard</Link>
              <Link href="/goals">Goals</Link>
              <Link href="/people">People</Link>
              <Link href="/reviews">Reviews</Link>
            </nav>
          </header>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
