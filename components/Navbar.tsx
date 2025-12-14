"use client";

import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, User, Menu, X, Globe } from "lucide-react";
import DesktopNav from "./navbar/DesktopNav";
import MobileNav from "./navbar/MobileNav";
import UserMenu from "./navbar/UserMenu";

export default function Navbar() {
  const { data: session } = useSession();
  const { items: cartItems, isLoaded: cartLoaded } = useCart();
  const { items: wishlistItems, isLoaded: wishlistLoaded } = useWishlist();
  const { locale, setLocale, t, isLoaded: langLoaded } = useLanguage();
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartItemsCount = cartLoaded
    ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
    : 0;
  const wishlistCount = wishlistLoaded ? wishlistItems.length : 0;

  // Detectar scroll para cambiar estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar mobile menu al cambiar ruta
  useEffect(() => {
    return () => {
      setShowMobileMenu(false);
    };
  }, [pathname]);

  const toggleLocale = () => {
    setLocale(locale === "es" ? "en" : "es");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-900/95 backdrop-blur-lg shadow-2xl"
          : "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent group-hover:from-red-400 group-hover:to-red-500 transition-all duration-300">
                Red Estampación
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <DesktopNav session={session} t={t} />

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Language Toggle - Desktop */}
            {langLoaded && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleLocale}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition backdrop-blur-sm"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-bold">
                  {locale.toUpperCase()}
                </span>
              </motion.button>
            )}

            {/* Wishlist */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/wishlist" className="relative">
                <div className="p-2 hover:bg-white/10 rounded-lg transition">
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className="w-6 h-6 text-red-400 group-hover:text-red-300 transition" />
                  </motion.div>
                </div>
                {wishlistLoaded && wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, y: -10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0, y: -10 }}
                    className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-gray-900 shadow-lg pointer-events-none"
                  >
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/carrito" className="relative group">
                <div className="p-2 hover:bg-white/10 rounded-lg transition">
                  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }}>
                    <ShoppingCart className="w-6 h-6 text-red-400 group-hover:text-red-300 transition" />
                  </motion.div>
                </div>
                {cartLoaded && cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, y: -10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0, y: -10 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-gray-900 shadow-lg pointer-events-none"
                  >
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>

            {/* User menu - Desktop */}
            <div className="hidden md:block">
              {session ? (
                <UserMenu session={session} locale={locale} t={t} />
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  className="bg-white text-gray-900 px-4 lg:px-6 py-2 rounded-lg hover:bg-gray-100 transition font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl text-sm lg:text-base"
                >
                  <User className="w-4 h-4" />
                  {t("nav.signIn")}
                </motion.button>
              )}
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
            >
              <AnimatePresence mode="wait">
                {showMobileMenu ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <MobileNav
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
          session={session}
          locale={locale}
          toggleLocale={toggleLocale}
          t={t}
          langLoaded={langLoaded}
        />
      </div>
    </motion.nav>
  );
}
