import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Sparkles,
  Code2,
  Smartphone,
  Zap,
  ArrowRight,
  Coins,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import LoginModal from "../components/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";

const highlightCard = [
  {
    id: 0,
    icon: Code2,
    title: "AI-Powered Code Generation",
    description:
      "Turn your ideas into clean, modern, and production-ready code with the power of AI.",
  },
  {
    id: 1,
    icon: Smartphone,
    title: "Responsive by Default",
    description:
      "Generate beautiful websites that automatically adapt to desktop, tablet, and mobile screens.",
  },
  {
    id: 2,
    icon: Zap,
    title: "Build Faster with AI",
    description:
      "Skip repetitive development work and transform your ideas into working websites in seconds.",
  },
];

const Home = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.userDetails);

  const [openLogin, setOpenLogin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });

      dispatch(setUserData(null));
    } catch (error) {
      console.log("the error is come from frontend logout", error);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Background Effects */}
      <div className="pointer-events-none absolute left-1/2 top-[-200px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[140px]" />

      <div className="pointer-events-none absolute bottom-[-200px] left-[-100px] h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[130px]" />

      {/* Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 100,
        }}
        className="relative z-20 border-b border-white/10 bg-black/60 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 items-center justify-between px-4 sm:h-[72px] sm:px-6 md:px-10 lg:px-14">
          {/* Logo */}
          <div className="shrink-0">
            <h2 className="text-lg font-bold tracking-tight sm:text-xl md:text-2xl">
              web
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                GenAI
              </span>
            </h2>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Pricing */}
            <button className="cursor-pointer text-sm font-medium text-gray-400 transition-colors duration-200 hover:text-white sm:text-base">
              Pricing
            </button>

            {/* Credits - Desktop / Tablet */}
            {userData && (
              <div className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-gray-300 md:flex">
                <Coins size={16} className="text-yellow-400" />

                <span>{userData.credits}</span>
              </div>
            )}

            {/* Login / Profile */}
            {!userData ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setOpenLogin(true)}
                className="cursor-pointer whitespace-nowrap rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black transition-colors duration-200 hover:bg-gray-200 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                Login
              </motion.button>
            ) : (
              <div className="relative">
                {/* Avatar */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="cursor-pointer rounded-full border border-white/10 p-0.5 transition-colors duration-200 hover:border-white/30"
                >
                  <img
                    src={
                      userData.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        userData.name,
                      )}&background=random&color=fff`
                    }
                    alt={userData.name || "User"}
                    className="h-8 w-8 rounded-full object-cover sm:h-9 sm:w-9 md:h-10 md:w-10"
                  />
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -8,
                        scale: 0.96,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: -8,
                        scale: 0.96,
                      }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/50"
                    >
                      {/* User Info */}
                      <div className="border-b border-white/10 p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              userData.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                userData.name,
                              )}&background=random&color=fff`
                            }
                            alt={userData.name || "User"}
                            className="h-10 w-10 rounded-full object-cover"
                          />

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {userData.name}
                            </p>

                            <p className="truncate text-xs text-gray-500">
                              {userData.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Credits - Mobile Only */}
                      <div className="p-3 md:hidden">
                        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <Coins size={15} className="text-yellow-400" />

                            <span className="text-xs text-gray-400">
                              Available Credits
                            </span>
                          </div>

                          <span className="text-sm font-semibold text-white">
                            {userData.credits}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="border-t border-white/10 p-2">
                        <button
                          onClick={() => {
                            setIsOpen(false);
                          }}
                          className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                        >
                          <LayoutDashboard size={16} />
                          Dashboard
                        </button>

                        <button
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                            // logout function
                          }}
                          className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-5 pb-16 pt-20 text-center sm:px-8 sm:pt-28 md:pt-32 lg:pb-24">
        {/* Small Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.5,
          }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-300 backdrop-blur-md sm:text-sm"
        >
          <Sparkles size={15} className="text-violet-400" />
          Build websites with AI
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.6,
          }}
          className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Build stunning websites
          <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            with AI
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.45,
            duration: 0.6,
          }}
          className="mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg md:text-xl"
        >
          Describe your idea and let AI generate a modern website with all the
          features you need — responsive, beautiful, and production-ready.
        </motion.p>

        {/* CTA */}
        {userData ? (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.6,
              duration: 0.5,
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="group mt-8 flex cursor-pointer items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black shadow-xl shadow-white/5 transition hover:bg-gray-200 sm:px-7 sm:py-3.5 sm:text-base"
          >
            Go To Dashboard
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </motion.button>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.6,
              duration: 0.5,
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setOpenLogin(true)}
            className="group mt-8 flex cursor-pointer items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black shadow-xl shadow-white/5 transition hover:bg-gray-200 sm:px-7 sm:py-3.5 sm:text-base"
          >
            Get Started
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </motion.button>
        )}
      </section>

      {/* Highlight Cards */}
      <section className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-4 px-5 pb-20 sm:px-8 md:grid-cols-3 lg:gap-5">
        {highlightCard.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.id}
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.7 + index * 0.15,
                duration: 0.5,
              }}
              whileHover={{
                y: -6,
                transition: {
                  duration: 0.2,
                },
              }}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
            >
              {/* Icon */}
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition duration-300 group-hover:bg-white/10">
                <Icon
                  size={21}
                  className="text-violet-400 transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                {card.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                {card.description}
              </p>
            </motion.div>
          );
        })}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-5 py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Gen Web AI. All rights reserved.
      </footer>

      {/* Login Modal */}
      {openLogin && (
        <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
      )}
    </div>
  );
};

export default Home;
