"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  ShoppingCart,
  Grid,
  Sparkles,
  Shirt,
  Settings,
} from "lucide-react";

export default function DesktopNav({ session }: { session: any; t: any }) {
  const pathname = usePathname();
  const isAdmin = session?.user?.role === "ADMIN";

  const navLinks = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/productos", label: "Productos", icon: ShoppingCart },
    { href: "/colecciones", label: "Colecciones", icon: Grid },
    { href: "/outfit-generator", label: "IA Stylist", icon: Sparkles },
    { href: "/closet", label: "Mi Armario", icon: Shirt },
  ];

  return (
    <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
      {navLinks.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/" && pathname.startsWith(link.href));

        return (
          <Link key={link.href} href={link.href} className="relative group">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? "text-red-400 bg-red-500/10"
                  : "text-white/80 hover:text-white hover:bg-white/5"
              }`}
            >
              <link.icon className="w-4 h-4" />
              <span className="font-medium hidden lg:inline text-sm">
                {link.label}
              </span>
            </div>
            {isActive && (
              <motion.div
                layoutId="active-nav"
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                transition={{ duration: 0.3 }}
              />
            )}
          </Link>
        );
      })}

      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-semibold text-sm bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden lg:inline">Admin</span>
        </Link>
      )}
    </div>
  );
}
