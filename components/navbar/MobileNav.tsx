"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Package,
  LogOut,
  User,
  Globe,
  Home,
  ShoppingCart,
  Grid,
  Sparkles,
  Shirt,
} from "lucide-react";
import { signIn, signOut } from "next-auth/react";

interface MobileNavProps {
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  session: any;
  locale: string;
  toggleLocale: () => void;
  t: (key: string) => string;
  langLoaded: boolean;
}

export default function MobileNav({
  showMobileMenu,
  setShowMobileMenu,
  session,
  locale,
  toggleLocale,
  t,
  langLoaded,
}: MobileNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navLinks = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/productos", label: "Productos", icon: ShoppingCart },
    { href: "/colecciones", label: "Colecciones", icon: Grid },
    { href: "/outfit-generator", label: "IA Stylist", icon: Sparkles },
    { href: "/closet", label: "Mi Armario", icon: Shirt },
  ];

  const getUserImage = () => {
    if (session?.user?.image) {
      if (session.user.image.includes("googleusercontent")) {
        return session.user.image;
      }
      return session.user.image;
    }
    return null;
  };

  return (
    <AnimatePresence>
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden border-t border-gray-700 overflow-hidden"
        >
          <div className="py-4 space-y-3 px-4">
            {/* User info mobile */}
            {session && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="px-4 py-3 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg border border-red-500/20 flex items-center gap-3"
              >
                {getUserImage() ? (
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={getUserImage() || ""}
                    alt={session.user.name || "User"}
                    className="w-12 h-12 rounded-full border-2 border-red-500 object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg"
                  >
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </motion.div>
                )}
                <div>
                  <p className="text-sm font-semibold text-white">
                    {session.user.name || "Usuario"}
                  </p>
                  <p className="text-xs text-gray-300">{session.user.email}</p>
                </div>
              </motion.div>
            )}

            {/* Navigation links */}
            <div className="space-y-2">
              {navLinks.map((link, idx) => {
                const active = isActive(link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        active
                          ? "bg-red-500/20 border border-red-500/50 text-red-400"
                          : "hover:bg-white/5 text-white/80 hover:text-white"
                      }`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <link.icon className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* My Orders */}
            {session && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Link
                  href="/mis-ordenes"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg transition text-white/80 hover:text-white"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Package className="w-5 h-5 text-red-400" />
                  <span className="font-medium">{t("nav.myOrders")}</span>
                </Link>
              </motion.div>
            )}

            {/* Admin Panel */}
            {session?.user?.role === "ADMIN" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition font-medium text-white shadow-lg"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Settings className="w-5 h-5" />
                  <span>{locale === "es" ? "Panel Admin" : "Admin Panel"}</span>
                </Link>
              </motion.div>
            )}

            {/* Language toggle mobile */}
            {langLoaded && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    toggleLocale();
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 rounded-lg transition text-white/80 hover:text-white"
                >
                  <Globe className="w-5 h-5 text-red-400" />
                  <span className="font-medium">
                    {locale === "es" ? "English" : "Español"}
                  </span>
                </motion.button>
              </motion.div>
            )}

            {/* Auth button mobile */}
            <div className="pt-2 border-t border-gray-700">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {session ? (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setShowMobileMenu(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{t("nav.signOut")}</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setShowMobileMenu(false);
                      signIn("google", { callbackUrl: "/" });
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-lg transition font-semibold"
                  >
                    <User className="w-5 h-5" />
                    <span>{t("nav.signIn")}</span>
                  </motion.button>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
