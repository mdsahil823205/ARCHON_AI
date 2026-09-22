
import { useState } from "react";
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
  ChevronDown,
  Plus,
  PackagePlus,
} from "lucide-react";
import LoginModal from "../components/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

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
      "Generate websites that automatically adapt to desktop, tablet, and mobile screens.",
  },
  {
    id: 2,
    icon: Zap,
    title: "Build Faster",
    description:
      "Skip repetitive development work and turn your ideas into working websites faster.",
  },
];

const Home = () => {
  const navigate = useNavigate();
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
      setIsOpen(false);
    } catch (error) {
      console.log("the error is come from frontend logout", error);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#0a0a0a] text-white">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0a0a0a]"
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[68px] sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex cursor-pointer items-center gap-2"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-black">
              <Sparkles size={14} />
            </div>

            <h2 className="text-base font-semibold tracking-tight sm:text-lg">
              WebGen
            </h2>
          </button>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Pricing */}
            <button
              onClick={() => navigate("/pricing")}
              type="button"
              className="hidden cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-white/[0.04] hover:text-white sm:block"
            >
              Pricing
            </button>

            {/* Credits */}
            {userData && (
              <div className="hidden cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-gray-300 md:flex"
                onClick={() => navigate("/pricing")}>
                <Coins size={15} className="text-gray-400" />
                <span >{userData.credits}</span>
              </div>
            )}

            {/* Login */}
            {!userData ? (
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setOpenLogin(true)}
                className="cursor-pointer rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-gray-200 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                Login
              </motion.button>
            ) : (
              <div className="relative">
                {/* Avatar */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-1 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <img
                    src={
                      userData.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        userData.name
                      )}&background=random&color=fff`
                    }
                    alt={userData.name || "User"}
                    className="h-8 w-8 rounded-md object-cover sm:h-9 sm:w-9"
                  />

                  <ChevronDown
                    size={15}
                    className={`mr-1 hidden text-gray-500 transition-transform duration-200 sm:block ${isOpen ? "rotate-180" : ""
                      }`}
                  />
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -8,
                        scale: 0.97,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: -8,
                        scale: 0.97,
                      }}
                      transition={{ duration: 0.16 }}
                      className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-2xl shadow-black/40"
                    >
                      {/* User Info */}
                      <div className="border-b border-white/[0.08] p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              userData.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                userData.name
                              )}&background=random&color=fff`
                            }
                            alt={userData.name || "User"}
                            className="h-10 w-10 rounded-lg object-cover"
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

                      {/* Credits - Mobile */}
                      <div className="p-3 md:hidden">
                        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
                          <div className="flex items-center gap-2" onClick={() => navigate("/pricing")}>
                            <Coins size={15} className="text-gray-400" />

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
                      <div className="border-t border-white/[0.08] p-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            navigate("/dashboard");
                          }}
                          className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/[0.05] hover:text-white"
                        >
                          <LayoutDashboard size={16} />
                          Dashboard
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            navigate("/generate");
                          }}
                          className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-gray-300 transition-colors hover:bg-white/[0.05] hover:text-white"
                        >
                          <PackagePlus size={16} />
                          Generate
                        </button>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-gray-400 transition-colors hover:bg-white/[0.05] hover:text-white"
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

      {/* =====================================================
          HERO
      ====================================================== */}
      <main>
        <section className="mx-auto flex max-w-6xl flex-col items-center px-5 pb-20 pt-20 text-center sm:px-8 sm:pb-24 sm:pt-28 md:pt-32">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
            }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-gray-400 sm:text-sm"
          >
            <Sparkles size={14} />
            Build websites with AI
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.08,
              duration: 0.5,
            }}
            className="max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Build websites
            <span className="block text-gray-400">
              with AI
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.16,
              duration: 0.5,
            }}
            className="mt-6 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base sm:leading-7 md:text-lg"
          >
            Describe your idea and let WebGen create a modern,
            responsive website with the features you need.
          </motion.p>

          {/* CTA */}
          {userData ? (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.24,
                duration: 0.45,
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/dashboard")}
              className="group mt-8 flex cursor-pointer items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-200 sm:px-7 sm:py-3.5 sm:text-base"
            >
              Go To Dashboard

              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </motion.button>
          ) : (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.24,
                duration: 0.45,
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOpenLogin(true)}
              className="group mt-8 flex cursor-pointer items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-200 sm:px-7 sm:py-3.5 sm:text-base"
            >
              Get Started

              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </motion.button>
          )}
        </section>

        {/* =====================================================
            FEATURE CARDS
        ====================================================== */}
        <section className="mx-auto grid max-w-6xl grid-cols-1 gap-3 px-5 pb-20 sm:px-8 md:grid-cols-3 md:gap-4 lg:pb-24">
          {highlightCard.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.35 + index * 0.08,
                  duration: 0.4,
                }}
                whileHover={{
                  y: -3,
                }}
                className="group rounded-xl border border-white/[0.08] bg-[#111111] p-5 transition-colors duration-200 hover:border-white/[0.15] hover:bg-[#141414] sm:p-6"
              >
                {/* Icon */}
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-gray-400 transition-colors duration-200 group-hover:bg-white/[0.06] group-hover:text-white">
                  <Icon size={19} />
                </div>

                {/* Content */}
                <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                  {card.title}
                </h2>

                <p className="mt-2.5 text-sm leading-6 text-gray-500">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="border-t border-white/[0.08] px-5 py-6 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} WebGen AI. All rights reserved.
      </footer>

      {/* =====================================================
          LOGIN MODAL
      ====================================================== */}
      {openLogin && (
        <LoginModal
          open={openLogin}
          onClose={() => setOpenLogin(false)}
        />
      )}
    </div>
  );
};

export default Home;
