import React, { useState } from "react";
import {
    ArrowLeft,
    Coins,
    Check,
    Sparkles,
    Zap,
    Building2,
    LayoutDashboard,
    LogOut,
    ChevronDown,
    CreditCard,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import LoginModal from "../components/LoginModal";
import ThemeToggle from "../components/ThemeToggle";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { useTheme } from "../context/ThemeContext";

const Pricing = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { theme } = useTheme();

    const { userData } = useSelector((state) => state.userDetails);

    const [openLogin, setOpenLogin] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const pricingPlans = [
        {
            key: "free",
            name: "Free",
            price: 0,
            credits: 50,
            descriptions:
                "Perfect for getting started with AI website generation.",
            feature: [
                "50 AI credits",
                "3 websites",
                "Basic templates",
                "Free subdomain",
                "Community support",
            ],
            popular: false,
            button: "Get Started",
            icon: Zap,
        },

        {
            key: "pro",
            name: "Pro",
            price: 499,
            credits: 500,
            descriptions:
                "For creators and developers who want more power.",
            feature: [
                "500 AI credits",
                "Unlimited websites",
                "Premium templates",
                "Custom domain",
                "Advanced AI features",
                "Priority support",
                "Remove WebGen branding",
            ],
            popular: true,
            button: "Upgrade to Pro",
            icon: Sparkles,
        },

        {
            key: "enterprise",
            name: "Enterprise",
            price: 1499,
            credits: 2000,
            descriptions:
                "Powerful tools for teams and growing businesses.",
            feature: [
                "2000 AI credits",
                "Unlimited websites",
                "Premium templates",
                "Custom domain",
                "Team collaboration",
                "API access",
                "Advanced analytics",
                "Dedicated support",
            ],
            popular: false,
            button: "Get Enterprise",
            icon: Building2,
        },
    ];

    // Logout
    const handleLogout = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, {
                withCredentials: true,
            });

            dispatch(setUserData(null));
            setIsOpen(false);
        } catch (error) {
            console.log("Logout error:", error);
        }
    };

    // Plan button
    const handlePlanClick = (plan) => {
        if (!userData) {
            setOpenLogin(true);
            return;
        }

        if (plan.key === "free") {
            navigate("/generate");
            return;
        }

        // Payment integration yahan add karna
        console.log("Selected plan:", plan.key);
    };

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-[var(--bg-secondary)] text-[var(--text-primary)]">
            {/* =====================================================
          BACKGROUND
      ====================================================== */}

            <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ opacity: "var(--bg-glow-opacity)" }}>
                <div className="absolute left-1/2 top-[-300px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/[0.055] blur-[140px]" />

                <div className="absolute bottom-[-200px] left-[-150px] h-[400px] w-[400px] rounded-full bg-violet-500/[0.035] blur-[120px]" />

                <div className="absolute right-[-180px] top-[40%] h-[350px] w-[350px] rounded-full bg-blue-500/[0.03] blur-[120px]" />
            </div>

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
                className="sticky top-0 z-50 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]/90 backdrop-blur-xl"
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[68px] sm:px-6 lg:px-8">
                    {/* LEFT */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="group flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2 text-sm font-medium text-[var(--text-muted)] transition-all hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] sm:px-3"
                        >
                            <ArrowLeft
                                size={17}
                                className="transition-transform duration-200 group-hover:-translate-x-0.5"
                            />

                            <span>Back</span>
                        </button>

                        <div className="hidden h-5 w-px bg-[var(--border-primary)] sm:block" />

                        <div className="hidden items-center gap-2 sm:flex">
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--logo-bg)] text-[var(--logo-text)]">
                                <Sparkles size={14} />
                            </div>

                            <span className="text-sm font-semibold tracking-tight">
                                WebGen
                            </span>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Credits */}
                        {userData && (
                            <button
                                type="button"
                                onClick={() => navigate("/pricing")}
                                className="hidden cursor-pointer items-center gap-2 rounded-lg border border-[var(--border-primary)] bg-[var(--hover-bg)] px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--border-hover)] hover:bg-[var(--hover-bg-strong)] hover:text-[var(--text-primary)] md:flex"
                            >
                                <Coins size={15} className="text-[var(--text-muted)]" />

                                <span className="text-[var(--text-faint)]">Credits</span>

                                <span className="font-semibold text-[var(--text-primary)]">
                                    {userData?.credits ?? 0}
                                </span>
                            </button>
                        )}

                        {/* Login */}
                        {!userData ? (
                            <motion.button
                                type="button"
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setOpenLogin(true)}
                                className="cursor-pointer rounded-lg bg-[var(--btn-primary-bg)] px-4 py-2 text-xs font-semibold text-[var(--btn-primary-text)] transition-colors hover:bg-[var(--btn-primary-hover)] sm:px-5 sm:py-2.5 sm:text-sm"
                            >
                                Login
                            </motion.button>
                        ) : (
                            /* PROFILE */
                            <div className="relative">
                                <motion.button
                                    type="button"
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => setIsOpen((prev) => !prev)}
                                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border-primary)] bg-[var(--hover-bg)] p-1 transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--hover-bg-strong)]"
                                >
                                    <img
                                        src={
                                            userData.avatar ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                userData.name || "User"
                                            )}&background=random&color=fff`
                                        }
                                        alt={userData.name || "User"}
                                        className="h-8 w-8 rounded-md object-cover sm:h-9 sm:w-9"
                                    />

                                    <ChevronDown
                                        size={15}
                                        className={`mr-1 hidden text-[var(--text-faint)] transition-transform duration-200 sm:block ${isOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </motion.button>

                                {/* DROPDOWN */}
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
                                            className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-[var(--border-primary)] bg-[var(--dropdown-bg)]"
                                            style={{ boxShadow: "var(--dropdown-shadow)" }}
                                        >
                                            {/* USER INFO */}
                                            <div className="border-b border-[var(--divider)] p-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            userData.avatar ||
                                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                                userData.name || "User"
                                                            )}&background=random&color=fff`
                                                        }
                                                        alt={userData.name || "User"}
                                                        className="h-10 w-10 rounded-lg object-cover"
                                                    />

                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                                                            {userData.name}
                                                        </p>

                                                        <p className="truncate text-xs text-[var(--text-faint)]">
                                                            {userData.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* MOBILE CREDITS */}
                                            <div className="p-3 md:hidden">
                                                <div className="flex items-center justify-between rounded-lg border border-[var(--border-primary)] bg-[var(--hover-bg)] px-3 py-2.5">
                                                    <div
                                                        className="flex cursor-pointer items-center gap-2"
                                                        onClick={() => navigate("/pricing")}
                                                    >
                                                        <Coins
                                                            size={15}
                                                            className="text-[var(--text-muted)]"
                                                        />

                                                        <span className="text-xs text-[var(--text-muted)]">
                                                            Available Credits
                                                        </span>
                                                    </div>

                                                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                                                        {userData?.credits ?? 0}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* ACTIONS */}
                                            <div className="border-t border-[var(--divider)] p-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        navigate("/dashboard");
                                                    }}
                                                    className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--hover-bg-strong)] hover:text-[var(--text-primary)]"
                                                >
                                                    <LayoutDashboard size={16} />
                                                    Dashboard
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={handleLogout}
                                                    className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--hover-bg-strong)] hover:text-[var(--text-primary)]"
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
          MAIN
      ====================================================== */}

            <main className="relative z-10">
                {/* HEADING */}

                <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pb-12 sm:pt-20 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--badge-border)] bg-[var(--badge-bg)] px-3.5 py-2 text-xs font-medium text-[var(--badge-text)]"
                    >
                        <Sparkles size={13} />
                        Simple & transparent pricing
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08, duration: 0.5 }}
                        className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl md:text-6xl"
                    >
                        Build more.
                        <span className="block text-[var(--text-muted)]">
                            Pay only when you need more.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.16, duration: 0.45 }}
                        className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[var(--text-muted)] sm:text-base"
                    >
                        Start with free AI credits and upgrade when your projects
                        grow. No complicated pricing.
                    </motion.p>
                </section>


                {/* =====================================================
            PRICING CARDS
        ====================================================== */}

                <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 pb-20 sm:px-6 md:grid-cols-3 lg:px-8">
                    {pricingPlans.map((plan, index) => {
                        const Icon = plan.icon;

                        return (
                            <motion.article
                                key={plan.key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.15 + index * 0.08,
                                    duration: 0.45,
                                }}
                                whileHover={{ y: -4 }}
                                className={`relative flex flex-col overflow-hidden rounded-2xl border bg-[var(--bg-card)] ${plan.popular
                                    ? "border-blue-500/40 shadow-xl shadow-blue-500/[0.07]"
                                    : "border-[var(--border-primary)]"
                                    }`}
                                style={!plan.popular ? { boxShadow: "var(--card-shadow)" } : undefined}
                            >
                                {/* Popular badge */}
                                {plan.popular && (
                                    <div className="absolute right-4 top-4 rounded-full border border-blue-500/20 bg-blue-500/[0.09] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                                        Most Popular
                                    </div>
                                )}

                                <div className="flex flex-1 flex-col p-5 sm:p-6">
                                    {/* Plan header */}
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-xl border ${plan.popular
                                                ? "border-blue-500/20 bg-blue-500/[0.08] text-blue-400"
                                                : "border-[var(--border-primary)] bg-[var(--hover-bg)] text-[var(--text-muted)]"
                                                }`}
                                        >
                                            <Icon size={19} />
                                        </div>

                                        <div>
                                            <h2 className="text-base font-semibold text-[var(--text-primary)]">
                                                {plan.name}
                                            </h2>

                                            <p className="text-xs text-[var(--text-faint)]">
                                                {plan.credits} AI credits
                                            </p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="mt-5 min-h-[48px] text-sm leading-6 text-[var(--text-muted)]">
                                        {plan.descriptions}
                                    </p>

                                    {/* Price */}
                                    <div className="mt-6 flex items-end gap-1">
                                        <span className="text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
                                            ₹{plan.price}
                                        </span>

                                        {plan.price > 0 && (
                                            <span className="mb-1 text-xs text-[var(--text-faint)]">
                                                / month
                                            </span>
                                        )}
                                    </div>

                                    {/* Credits */}
                                    <div className="mt-5 flex items-center rounded-xl border border-[var(--border-primary)] bg-[var(--hover-bg)] px-3 py-3">
                                        <div className="flex items-center gap-2">
                                            <Coins size={15} className="text-blue-400" />

                                            <span className="text-xs text-[var(--text-muted)]">
                                                AI Credits
                                            </span>
                                        </div>

                                        <span className="ml-auto text-sm font-semibold text-[var(--text-primary)]">
                                            {plan.credits}
                                        </span>
                                    </div>

                                    {/* Features */}
                                    <div className="mt-6 flex-1">
                                        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--text-faint)]">
                                            Includes
                                        </p>

                                        <ul className="space-y-3">
                                            {plan.feature.map((feature) => (
                                                <li
                                                    key={feature}
                                                    className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]"
                                                >
                                                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500/[0.1] text-blue-400">
                                                        <Check size={10} />
                                                    </span>

                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Button */}
                                    <motion.button
                                        type="button"
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handlePlanClick(plan)}
                                        className={`mt-4 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all ${plan.popular
                                            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/10 hover:bg-blue-400"
                                            : "border border-[var(--border-primary)] bg-[var(--hover-bg)] text-[var(--text-primary)] hover:border-[var(--border-hover)] hover:bg-[var(--hover-bg-strong)]"
                                            }`}
                                    >
                                        <CreditCard size={15} />

                                        {userData
                                            ? plan.button
                                            : plan.key === "free"
                                                ? "Login to Get Started"
                                                : "Login to Purchase"}
                                    </motion.button>
                                </div>
                            </motion.article>
                        );
                    })}
                </section>

                {/* Bottom note */}

                <div className="mx-auto max-w-6xl px-4 pb-16 text-center sm:px-6 lg:px-8">
                    <p className="text-xs text-[var(--text-faint)]">
                        All plans include access to WebGen AI. Upgrade whenever
                        you need more credits and features.
                    </p>
                </div>
            </main>

            {/* =====================================================
          LOGIN MODAL
      ====================================================== */}

            <AnimatePresence>
                {openLogin && (
                    <LoginModal
                        open={openLogin}
                        onClose={() => setOpenLogin(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Pricing;