import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    ArrowLeft,
    Sparkles,
    WandSparkles,
    AlertCircle,
    Coins,
    ChevronDown,
    LayoutDashboard,
    CreditCard,
    LogOut,
    Home,
} from "lucide-react";
import axios from "axios";

import { serverUrl } from "../App";
import LoginModal from "../components/LoginModal";
import ThemeToggle from "../components/ThemeToggle";
import { setUserData } from "../redux/userSlice";


const Generate = () => {
    const thinkingSteps = [
        "Analyzing your request...",
        "Understanding the website requirements...",
        "Identifying the required sections...",
        "Planning the website structure...",
        "Planning the page layout...",
        "Choosing the design style and theme...",
        "Designing the user interface...",
        "Creating the navigation structure...",
        "Writing the HTML structure...",
        "Writing the CSS styles...",
        "Adding interactive functionality...",
        "Making the website responsive...",
        "Optimizing the website layout...",
        "Reviewing the generated code...",
        "Finalizing your website...",
    ];

    const examplePrompts = [
        "Portfolio for a software developer",
        "Landing page for a startup",
        "Modern restaurant website",
    ];

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userData } = useSelector((state) => state.userDetails);

    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);


    // ---------------------------------------------------------
    // Smooth simulated progress while API is generating
    // ---------------------------------------------------------

    useEffect(() => {
        if (!loading) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95) {
                    return 95;
                }

                let increment = 0.4;

                if (prev < 20) {
                    increment = 0.65;
                } else if (prev < 45) {
                    increment = 0.4;
                } else if (prev < 70) {
                    increment = 0.25;
                } else if (prev < 85) {
                    increment = 0.16;
                } else {
                    increment = 0.08;
                }

                return Math.min(prev + increment, 95);
            });
        }, 700);

        return () => clearInterval(interval);
    }, [loading]);


    // ---------------------------------------------------------
    // Change AI thinking message gradually
    // ---------------------------------------------------------

    useEffect(() => {
        if (!loading) return;

        const interval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev >= thinkingSteps.length - 1) {
                    return prev;
                }

                return prev + 1;
            });
        }, 1800);

        return () => clearInterval(interval);
    }, [loading, thinkingSteps.length]);


    // ---------------------------------------------------------
    // Logout
    // ---------------------------------------------------------

    const handleLogout = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, {
                withCredentials: true,
            });

            dispatch(setUserData(null));
            setIsProfileOpen(false);
            navigate("/");
        } catch (error) {
            console.log("Logout error:", error);
        }
    };


    // ---------------------------------------------------------
    // Generate website
    // ---------------------------------------------------------

    const handleGenerateWebsite = async () => {
        if (loading) return;

        if (!userData) {
            setIsLoginOpen(true);
            return;
        }

        if (!prompt.trim()) {
            setErrorMessage("Please describe the website you want to create.");
            return;
        }

        try {
            setLoading(true);
            setErrorMessage("");
            setProgress(0);
            setCurrentStep(0);

            const result = await axios.post(
                `${serverUrl}/api/website/generate`,
                {
                    prompt: prompt.trim(),
                },
                {
                    withCredentials: true,
                }
            );

            console.log("Website generation response:", result);

            const websiteId = result?.data?.website?._id;

            if (!websiteId) {
                throw new Error(
                    "Website was generated, but the website ID was not received."
                );
            }

            navigate(`/editor/${websiteId}`);
        } catch (error) {
            console.error("Website generation error:", error);

            let message =
                "Something went wrong while generating your website.";

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    message =
                        error.response.data?.message ||
                        error.response.data?.error ||
                        `Request failed with status ${error.response.status}.`;
                } else if (error.request) {
                    message =
                        "Unable to connect to the server. Please check your connection and try again.";
                } else {
                    message = error.message || message;
                }
            } else if (error instanceof Error) {
                message = error.message;
            }

            setErrorMessage(message);
        } finally {
            setLoading(false);
            setProgress(0);
            setCurrentStep(0);
        }
    };


    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">

            {/* =====================================================
          HEADER
      ====================================================== */}

            <header className="sticky top-0 z-50 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/95 backdrop-blur-xl">
                <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between px-4 sm:min-h-[68px] sm:px-6 lg:px-8">

                    {/* LEFT */}
                    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            disabled={loading}
                            className="group flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-lg px-2.5 text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-50"
                        >
                            <ArrowLeft
                                size={17}
                                className="transition-transform duration-200 group-hover:-translate-x-0.5"
                            />


                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            disabled={loading}
                            className="group flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-lg px-2.5 text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-50"
                        >
                            <Home
                                size={17}
                                className="transition-transform duration-200 group-hover:-translate-x-0.5"
                            />


                        </button>


                        <div className="hidden h-5 w-px bg-[var(--border-primary)] sm:block" />

                        {/* LOGO */}
                        <div className="flex min-w-0 items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--logo-bg)] text-[var(--logo-text)]">
                                <Sparkles size={14} />
                            </div>

                            <h1 className="truncate text-sm font-semibold tracking-tight sm:text-base">
                                Archon Ai
                            </h1>
                        </div>
                    </div>


                    {/* RIGHT */}
                    <div className="relative flex items-center gap-2 sm:gap-3">

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Desktop Credits */}
                        {userData && (
                            <button
                                type="button"
                                onClick={() => navigate("/pricing")}
                                className="hidden h-9 cursor-pointer items-center gap-2 rounded-lg border border-[var(--border-primary)] bg-[var(--hover-bg)] px-3 text-xs text-[var(--text-secondary)] transition-all hover:border-[var(--border-hover)] hover:bg-[var(--hover-bg-strong)] hover:text-[var(--text-primary)] md:flex"
                            >
                                <Coins
                                    size={14}
                                    className="text-[var(--text-muted)]"
                                />

                                <span>
                                    Credits
                                </span>

                                <span className="rounded-md bg-[var(--hover-bg-strong)] px-2 py-0.5 font-medium text-[var(--text-primary)]">
                                    {userData?.credits ?? 0}
                                </span>
                            </button>
                        )}


                        {/* Profile */}
                        {userData ? (
                            <button
                                type="button"
                                onClick={() =>
                                    setIsProfileOpen((prev) => !prev)
                                }
                                className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-[var(--border-primary)] bg-[var(--hover-bg)] px-1.5 pr-2 transition-all hover:border-[var(--border-hover)] hover:bg-[var(--hover-bg-strong)] sm:gap-2"
                            >
                                <img
                                    src={
                                        userData.avatar ||
                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                            userData.name || "User"
                                        )}&background=random&color=fff`
                                    }
                                    alt={userData.name || "User"}
                                    className="h-7 w-7 rounded-md object-cover sm:h-8 sm:w-8"
                                />

                                <span className="hidden max-w-24 truncate text-xs font-medium text-[var(--text-secondary)] lg:block">
                                    {userData.name || "User"}
                                </span>

                                <ChevronDown
                                    size={14}
                                    className={`hidden text-[var(--text-faint)] transition-transform lg:block ${isProfileOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsLoginOpen(true)}
                                className="flex h-9 cursor-pointer items-center rounded-lg bg-[var(--btn-primary-bg)] px-3.5 text-xs font-medium text-[var(--btn-primary-text)] transition-colors hover:bg-[var(--btn-primary-hover)] sm:px-4"
                            >
                                Login
                            </button>
                        )}


                        {/* PROFILE DROPDOWN */}
                        <AnimatePresence>
                            {userData && isProfileOpen && (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: -6,
                                        scale: 0.98,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -6,
                                        scale: 0.98,
                                    }}
                                    transition={{
                                        duration: 0.16,
                                    }}
                                    className="absolute right-0 top-full z-50 mt-2 w-[calc(100vw-2rem)] max-w-72 overflow-hidden rounded-xl border border-[var(--border-primary)] bg-[var(--dropdown-bg)]"
                                    style={{ boxShadow: "var(--dropdown-shadow)" }}
                                >

                                    {/* USER INFO */}
                                    <div className="border-b border-[var(--divider)] p-3.5">
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
                                                <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                                                    {userData.name || "User"}
                                                </p>

                                                <p className="truncate text-xs text-[var(--text-faint)]">
                                                    {userData.email || "Archon Ai User"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>


                                    {/* MOBILE CREDITS */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            navigate("/pricing");
                                        }}
                                        className="flex w-full items-center justify-between border-b border-[var(--divider)] px-3.5 py-3 text-left transition-colors hover:bg-[var(--hover-bg)] md:hidden"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--hover-bg-strong)]">
                                                <Coins
                                                    size={15}
                                                    className="text-[var(--text-secondary)]"
                                                />
                                            </div>

                                            <div>
                                                <p className="text-xs font-medium text-[var(--text-secondary)]">
                                                    Credits
                                                </p>

                                                <p className="text-[11px] text-[var(--text-faint)]">
                                                    Available credits
                                                </p>
                                            </div>
                                        </div>

                                        <span className="rounded-md bg-[var(--hover-bg-strong)] px-2 py-1 text-xs font-medium text-[var(--text-primary)]">
                                            {userData?.credits ?? 0}
                                        </span>
                                    </button>


                                    {/* DASHBOARD */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            navigate("/dashboard");
                                        }}
                                        className="flex w-full cursor-pointer items-center gap-3 px-3.5 py-3 text-left text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--hover-bg-strong)]">
                                            <LayoutDashboard size={15} />
                                        </div>

                                        <span>
                                            Dashboard
                                        </span>
                                    </button>


                                    {/* PRICING */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            navigate("/pricing");
                                        }}
                                        className="flex w-full cursor-pointer items-center gap-3 px-3.5 py-3 text-left text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--hover-bg-strong)]">
                                            <CreditCard size={15} />
                                        </div>

                                        <span>
                                            Pricing
                                        </span>
                                    </button>


                                    {/* LOGOUT */}
                                    <div className="border-t border-[var(--divider)] p-1.5">
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[var(--text-muted)] transition-colors hover:bg-red-500/[0.07] hover:text-red-300"
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/[0.06]">
                                                <LogOut size={15} />
                                            </div>

                                            <span>
                                                Logout
                                            </span>
                                        </button>
                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                </div>
            </header>


            {/* =====================================================
          MAIN
      ====================================================== */}

            <main className="flex min-h-[calc(100vh-64px)] flex-col">

                <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-4 py-12 sm:px-6 sm:py-16 md:py-20">

                    {/* =================================================
              HEADING
          ================================================== */}

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.45,
                            ease: "easeOut",
                        }}
                        className="w-full text-center"
                    >
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--badge-border)] bg-[var(--badge-bg)] px-3 py-1.5 text-xs text-[var(--badge-text)]">
                            <Sparkles size={13} />
                            <span>AI Website Builder</span>
                        </div>

                        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl md:text-5xl">
                            Build your website
                        </h1>

                        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[var(--text-muted)] sm:text-base">
                            Describe what you want to build and let Archon Ai create the website
                            for you.
                        </p>
                    </motion.div>


                    {/* =================================================
              GENERATOR CARD
          ================================================== */}

                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.08,
                            duration: 0.45,
                            ease: "easeOut",
                        }}
                        className="mt-10 w-full max-w-3xl sm:mt-12"
                    >

                        <div className="mb-3 flex items-center gap-2">
                            <WandSparkles
                                size={17}
                                className="text-[var(--text-muted)]"
                            />

                            <h2 className="text-sm font-medium text-[var(--text-secondary)]">
                                Describe your website
                            </h2>
                        </div>


                        {/* MAIN INPUT CARD */}
                        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-2.5 sm:p-3"
                            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}
                        >

                            {/* =================================================
                  PROGRESS BAR
              ================================================== */}

                            <AnimatePresence>
                                {loading && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            height: 0,
                                            y: -6,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            height: "auto",
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            height: 0,
                                            y: -6,
                                        }}
                                        transition={{
                                            duration: 0.25,
                                            ease: "easeOut",
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mb-3 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-input)] px-3.5 py-3 sm:px-4">

                                            <div className="mb-2.5 flex items-center justify-between gap-3">

                                                <div className="flex min-w-0 items-center gap-2.5">

                                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--hover-bg-strong)]">
                                                        <Sparkles
                                                            size={14}
                                                            className="animate-pulse text-[var(--text-secondary)]"
                                                        />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-xs font-medium text-[var(--text-secondary)]">
                                                            Building your website
                                                        </p>

                                                        <AnimatePresence mode="wait">
                                                            <motion.p
                                                                key={currentStep}
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: 3,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                exit={{
                                                                    opacity: 0,
                                                                    y: -3,
                                                                }}
                                                                transition={{
                                                                    duration: 0.2,
                                                                }}
                                                                className="mt-0.5 truncate text-[11px] text-[var(--text-faint)]"
                                                            >
                                                                {thinkingSteps[currentStep]}
                                                            </motion.p>
                                                        </AnimatePresence>
                                                    </div>
                                                </div>

                                                <span className="shrink-0 text-xs font-medium tabular-nums text-[var(--text-muted)]">
                                                    {Math.floor(progress)}%
                                                </span>
                                            </div>


                                            {/* Progress Track */}
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--progress-bg)]">
                                                <motion.div
                                                    className="h-full rounded-full bg-[var(--progress-fill)]"
                                                    animate={{
                                                        width: `${progress}%`,
                                                    }}
                                                    transition={{
                                                        duration: 0.1,
                                                        ease: "linear",
                                                    }}
                                                />
                                            </div>

                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>


                            {/* =================================================
                  ERROR MESSAGE
              ================================================== */}

                            <AnimatePresence>
                                {!loading && errorMessage && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            height: 0,
                                            y: -5,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            height: "auto",
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            height: 0,
                                            y: -5,
                                        }}
                                        transition={{
                                            duration: 0.25,
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mb-3 flex items-start gap-3 rounded-lg border border-red-500/15 bg-red-500/[0.05] px-3.5 py-3">

                                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-red-500/10">
                                                <AlertCircle
                                                    size={14}
                                                    className="text-red-400"
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-xs font-medium text-red-300">
                                                    Unable to generate website
                                                </p>

                                                <p className="mt-0.5 text-[11px] leading-5 text-red-400/70">
                                                    {errorMessage}
                                                </p>
                                            </div>

                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>


                            {/* =================================================
                  TEXTAREA
              ================================================== */}

                            <textarea
                                value={prompt}
                                onChange={(e) => {
                                    setPrompt(e.target.value);

                                    if (errorMessage) {
                                        setErrorMessage("");
                                    }
                                }}
                                disabled={loading}
                                placeholder="Example: Create a modern portfolio website for a software developer..."
                                className="min-h-44 w-full resize-none rounded-lg border border-[var(--border-primary)] bg-[var(--bg-input)] px-4 py-3.5 text-sm leading-6 text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-faint)] focus:border-[var(--border-hover)] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-52 sm:px-5 sm:py-4 sm:text-base"
                            />


                            {/* =================================================
                  BOTTOM CONTROLS
              ================================================== */}

                            <div className="flex flex-col gap-3 px-1 pt-3 sm:flex-row sm:items-center sm:justify-between">

                                <p className="hidden text-xs text-[var(--text-faint)] sm:block">
                                    Be as specific as possible for better results.
                                </p>

                                <motion.button
                                    type="button"
                                    onClick={handleGenerateWebsite}
                                    disabled={!prompt.trim() || loading}
                                    whileHover={{
                                        scale:
                                            !prompt.trim() || loading
                                                ? 1
                                                : 1.01,
                                    }}
                                    whileTap={{
                                        scale:
                                            !prompt.trim() || loading
                                                ? 1
                                                : 0.98,
                                    }}
                                    className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--btn-primary-bg)] px-6 text-sm font-medium text-[var(--btn-primary-text)] transition-all duration-200 hover:bg-[var(--btn-primary-hover)] disabled:cursor-not-allowed disabled:bg-[var(--skeleton-bg)] disabled:text-[var(--text-faint)] sm:w-auto"
                                >
                                    <Sparkles
                                        size={16}
                                        className={
                                            loading
                                                ? "animate-pulse"
                                                : ""
                                        }
                                    />

                                    {loading
                                        ? "Generating..."
                                        : "Generate Website"}
                                </motion.button>

                            </div>
                        </div>


                        {/* Small info */}
                        <p className="mt-3 px-1 text-xs text-[var(--text-faint)]">
                            Generation may take a few moments depending on the complexity of
                            your website.
                        </p>

                    </motion.div>


                    {/* =================================================
              EXAMPLE PROMPTS
          ================================================== */}

                    {!loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                                delay: 0.25,
                                duration: 0.5,
                            }}
                            className="mt-10 w-full max-w-3xl"
                        >
                            <p className="mb-3 text-xs font-medium text-[var(--text-muted)]">
                                Try something like
                            </p>

                            <div className="grid gap-2 sm:grid-cols-3">
                                {examplePrompts.map((example) => (
                                    <button
                                        key={example}
                                        type="button"
                                        onClick={() => {
                                            setPrompt(example);
                                            setErrorMessage("");
                                        }}
                                        className="rounded-lg border border-[var(--border-primary)] bg-[var(--hover-bg)] px-3 py-3 text-left text-xs text-[var(--text-muted)] transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--hover-bg-strong)] hover:text-[var(--text-secondary)]"
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                </div>
            </main>


            {/* =====================================================
          LOGIN MODAL
      ====================================================== */}

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
            />

        </div>
    );
};

export default Generate;