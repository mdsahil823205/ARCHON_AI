import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../App";
import {
    Code2,
    Rocket,
    Share2,
    Check,
    ExternalLink,
    Maximize2,
    MessageCircle,
    Send,
    X,
    PanelLeftClose,
    PanelLeftOpen,
    LayoutDashboard,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Editor from "@monaco-editor/react";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../../components/ThemeToggle";

const EditorPage = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [wesbsite, setWesbsite] = useState(null);
    const [error, setError] = useState("");
    const [code, setCode] = useState("");
    const [message, setMessage] = useState([]);
    const [prompt, setPrompt] = useState("");
    const [updateLoading, setUpdateLoading] = useState(false);
    const [thinkingIndex, setThinkingIndex] = useState(0);

    const [showCode, setShowCode] = useState(false);
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [sidebarWidth, setSidebarWidth] = useState(360);
    const [isResizing, setIsResizing] = useState(false);
    const [isFullPreview, setIsFullPreview] = useState(false);

    const [isDeploying, setIsDeploying] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [deployUrl, setDeployUrl] = useState("");

    const iframeRef = useRef(null);
    const chatInputRef = useRef(null);

    const { id } = useParams();

    const MIN_SIDEBAR_WIDTH = 280;
    const MAX_SIDEBAR_WIDTH = 560;

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

    // -----------------------------------------
    // Live iframe preview
    // -----------------------------------------
    useEffect(() => {
        if (!iframeRef.current || !code) return;

        const blob = new Blob([code], {
            type: "text/html",
        });

        const url = URL.createObjectURL(blob);

        iframeRef.current.src = url;

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [code]);

    // -----------------------------------------
    // Get website
    // -----------------------------------------
    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(
                    `${serverUrl}/api/website/get-website/${id}`,
                    {
                        withCredentials: true,
                    }
                );

                const website = result?.data?.website;

                setWesbsite(website);
                setCode(website?.latestCode || "");
                setMessage(website?.conversation || []);

                setDeployUrl(website?.deployUrl || "");

                setWesbsite(website);
                setCode(website?.latestCode || "");
                setMessage(website?.conversation || []);
            } catch (error) {
                console.log("Error while getting website:", error);

                setError(
                    error.response?.data?.message ||
                    "Something went wrong while loading the website."
                );
            }
        };

        handleGetWebsite();
    }, [id]);

    // -----------------------------------------
    // Thinking animation
    // -----------------------------------------
    useEffect(() => {
        if (!updateLoading) return;

        setThinkingIndex(0);

        const interval = setInterval(() => {
            setThinkingIndex(
                (prev) => (prev + 1) % thinkingSteps.length
            );
        }, 1800);

        return () => clearInterval(interval);
    }, [updateLoading]);

    // -----------------------------------------
    // Sidebar resize
    // -----------------------------------------
    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e) => {
            const newWidth = Math.min(
                Math.max(e.clientX, MIN_SIDEBAR_WIDTH),
                MAX_SIDEBAR_WIDTH
            );

            setSidebarWidth(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);

            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
    }, [isResizing]);

    // -----------------------------------------
    // Update website with AI
    // -----------------------------------------
    const handleUpdateWesbsite = async () => {
        if (!prompt.trim() || updateLoading) return;

        const currentPrompt = prompt.trim();

        try {
            setUpdateLoading(true);
            setThinkingIndex(0);

            setMessage((prev) => [
                ...prev,
                {
                    role: "user",
                    content: currentPrompt,
                },
            ]);

            setPrompt("");

            const res = await axios.post(
                `${serverUrl}/api/website/update/${id}`,
                {
                    prompt: currentPrompt,
                },
                {
                    withCredentials: true,
                }
            );

            setMessage((prev) => [
                ...prev,
                {
                    role: "ai",
                    content:
                        res.data.message || "Website updated successfully.",
                },
            ]);

            setCode(res.data.latestCode);

            // Close mobile chat after successful update
            setShowMobileChat(false);
        } catch (error) {
            console.log("Error while updating website:", error);

            setMessage((prev) => [
                ...prev,
                {
                    role: "ai",
                    content:
                        error.response?.data?.message ||
                        "Something went wrong while updating the website.",
                },
            ]);
        } finally {
            setUpdateLoading(false);
        }
    };

    // -----------------------------------------
    // Enter key
    // -----------------------------------------
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleUpdateWesbsite();
        }
    };

    // -----------------------------------------
    // Focus chat input
    // -----------------------------------------
    useEffect(() => {
        if (showMobileChat) {
            setTimeout(() => {
                chatInputRef.current?.focus();
            }, 250);
        }
    }, [showMobileChat]);

    // -----------------------------------------
    // Loading
    // -----------------------------------------


    // -----------------------------------------
    // deploy
    // -----------------------------------------
    const handleDeploy = async (id) => {
        try {
            setIsDeploying(true);

            const result = await axios.get(
                `${serverUrl}/api/website/deploy/${id}`,
                {
                    withCredentials: true,
                }
            );

            if (result?.data?.success) {
                const url = result.data.url;

                setDeployUrl(url);

                // Open deployed website
                window.open(url, "_blank");
            }
        } catch (error) {
            console.error("Deploy error:", error);

            alert(
                error?.response?.data?.message ||
                "Failed to deploy website"
            );
        } finally {
            setIsDeploying(false);
        }
    };

    // -----------------------------------------
    // share
    // -----------------------------------------
    const handleShare = async () => {
        if (!deployUrl) {
            alert("Please deploy your website first.");
            return;
        }

        try {
            await navigator.clipboard.writeText(deployUrl);

            setIsCopied(true);

            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Copy error:", error);
        }
    };
    if (!wesbsite && !error) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border-primary)] border-t-[var(--text-primary)]" />

                    <p className="text-sm text-[var(--text-muted)]">
                        Loading your website...
                    </p>
                </div>
            </div>
        );
    }

    // -----------------------------------------
    // Error
    // -----------------------------------------
    if (error) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-primary)] px-5 text-center">
                <div className="max-w-md">
                    <div className="mb-4 text-sm font-semibold text-red-500">
                        Something went wrong
                    </div>

                    <p className="text-sm text-[var(--text-muted)]">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
            {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}
            <AnimatePresence initial={false}>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{
                            width: sidebarWidth,
                            opacity: 1,
                        }}
                        exit={{
                            width: 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: isResizing ? 0 : 0.25,
                            ease: "easeOut",
                        }}
                        className="relative hidden h-full shrink-0 overflow-hidden border-r border-[var(--border-primary)] bg-[var(--bg-secondary)] transition-colors duration-200 lg:flex"
                    >
                        <div
                            className="flex h-full w-full min-w-0 flex-col"
                            style={{
                                width: sidebarWidth,
                            }}
                        >
                            <ChatHeader
                                website={wesbsite}
                                onClose={() => setSidebarOpen(false)}
                            />

                            <ChatContent
                                message={message}
                                updateLoading={updateLoading}
                                thinkingIndex={thinkingIndex}
                                thinkingSteps={thinkingSteps}
                                prompt={prompt}
                                setPrompt={setPrompt}
                                handleUpdateWesbsite={handleUpdateWesbsite}
                                handleKeyDown={handleKeyDown}
                                inputRef={chatInputRef}
                            />
                        </div>

                        {/* Resize Handle */}
                        <div
                            onMouseDown={() => setIsResizing(true)}
                            className={`absolute right-0 top-0 z-50 h-full w-1 cursor-col-resize transition-colors ${isResizing
                                ? "bg-[var(--border-hover)]"
                                : "bg-transparent hover:bg-[var(--hover-bg-strong)]"
                                }`}
                        />

                        {/* Resize visual indicator */}
                        <div
                            onMouseDown={() => setIsResizing(true)}
                            className="absolute right-[-3px] top-1/2 z-50 hidden h-14 w-1 cursor-col-resize rounded-full bg-[var(--border-primary)] transition-colors hover:bg-[var(--text-muted)] xl:block"
                        />
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* =========================================================
          MAIN PREVIEW
      ========================================================= */}
            <main className="relative flex min-w-0 flex-1 flex-col bg-[var(--bg-primary)]">
                {/* =======================================================
            PREVIEW NAVBAR
        ======================================================= */}
                <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 sm:h-16 sm:px-4 lg:px-5 transition-colors duration-200">
                    {/* Left */}
                    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                        {/* Desktop sidebar toggle */}
                        <button
                            onClick={() => setSidebarOpen((prev) => !prev)}
                            className="hidden h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[var(--border-primary)] bg-[var(--hover-bg)] text-[var(--text-muted)] transition hover:bg-[var(--hover-bg-strong)] hover:text-[var(--text-primary)] lg:flex"
                            title={
                                sidebarOpen
                                    ? "Hide conversation"
                                    : "Show conversation"
                            }
                        >
                            {sidebarOpen ? (
                                <PanelLeftClose size={17} />
                            ) : (
                                <PanelLeftOpen size={17} />
                            )}
                        </button>

                        {/* Mobile chat */}
                        <button
                            onClick={() => setShowMobileChat(true)}
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[var(--border-primary)] bg-[var(--hover-bg)] text-[var(--text-muted)] transition hover:bg-[var(--hover-bg-strong)] hover:text-[var(--text-primary)] lg:hidden"
                            title="Open conversation"
                        >
                            <MessageCircle size={18} />
                        </button>

                        <div className="min-w-0">
                            <p className="max-w-[160px] truncate text-sm font-semibold text-[var(--text-primary)] sm:max-w-xs sm:text-base">
                                {wesbsite?.title || "Untitled Website"}
                            </p>

                            <div className="hidden items-center gap-1.5 text-[11px] text-[var(--text-muted)] sm:flex">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Live preview
                            </div>
                        </div>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* Preview */}
                        <button
                            onClick={() => setIsFullPreview((prev) => !prev)}
                            className={`flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition sm:px-3 ${isFullPreview
                                ? "border-[var(--border-primary)] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]"
                                : "border-[var(--border-primary)] bg-[var(--hover-bg)] text-[var(--text-muted)] hover:bg-[var(--hover-bg-strong)] hover:text-[var(--text-primary)]"
                                }`}
                            title="Toggle full preview"
                        >
                            <Maximize2 size={15} />

                            <span className="hidden md:inline">
                                {isFullPreview ? "Exit Preview" : "Preview"}
                            </span>
                        </button>

                        {/* Code */}
                        <button
                            onClick={() => setShowCode(true)}
                            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--border-primary)] bg-[var(--hover-bg)] px-2.5 text-xs font-medium text-[var(--text-muted)] transition hover:bg-[var(--hover-bg-strong)] hover:text-[var(--text-primary)] sm:px-3"
                            title="Open code editor"
                        >
                            <Code2 size={15} />

                            <span className="hidden md:inline">
                                Code
                            </span>
                        </button>

                        {/* Deploy / Share */}
                        {wesbsite?.deployed ? (
                            /* ================= SHARE ================= */
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleShare();
                                }}
                                className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--border-primary)] bg-[var(--hover-bg)] px-3 text-xs font-medium text-[var(--text-muted)] transition hover:bg-[var(--hover-bg-strong)] hover:text-[var(--text-primary)] sm:px-4"
                                title="Copy deployed website link"
                            >
                                {isCopied ? (
                                    <Check
                                        size={15}
                                        className="text-emerald-500"
                                    />
                                ) : (
                                    <Share2 size={15} />
                                )}

                                <span className="hidden sm:inline">
                                    {isCopied ? "Copied" : "Share"}
                                </span>
                            </button>
                        ) : (
                            /* ================= DEPLOY ================= */
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeploy(id);
                                }}
                                disabled={isDeploying}
                                className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-[#2563eb] px-3 text-xs font-semibold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
                                title="Deploy website"
                            >
                                <Rocket
                                    size={15}
                                    className={isDeploying ? "animate-pulse" : ""}
                                />

                                <span className="hidden sm:inline">
                                    {isDeploying ? "Deploying..." : "Deploy"}
                                </span>
                            </button>
                        )}

                        <button
                            onClick={() => navigate("/dashboard")}
                            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--border-primary)] bg-[var(--hover-bg)] px-3 text-xs font-semibold text-[var(--text-primary)] transition hover:bg-[var(--hover-bg-strong)] sm:px-4"
                            title="Dashboard"
                        >
                            <LayoutDashboard size={14} />

                            <span className="hidden sm:inline">
                                Dashboard
                            </span>
                        </button>

                        {/* Theme Toggle */}
                        <ThemeToggle />
                    </div>
                </header>

                {/* =======================================================
            BROWSER PREVIEW AREA
        ======================================================= */}
                <div className="relative flex min-h-0 flex-1 overflow-hidden bg-[var(--bg-primary)]">
                    {/* Browser-like preview frame */}
                    <div
                        className={`relative flex h-full w-full flex-col overflow-hidden bg-white transition-all duration-300 ${isFullPreview
                            ? ""
                            : "lg:m-3 lg:rounded-xl lg:border lg:border-[var(--border-primary)] lg:shadow-2xl"
                            }`}
                    >
                        {/* Browser top bar - desktop */}
                        {!isFullPreview && (
                            <div className="hidden h-9 shrink-0 items-center gap-2 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 lg:flex">
                                <div className="flex gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                                </div>

                                <div className="mx-auto flex h-6 max-w-lg flex-1 items-center justify-center rounded-md border border-[var(--border-primary)] bg-[var(--bg-card)] px-3">
                                    <span className="truncate text-[10px] text-[var(--text-muted)]">
                                        localhost:3000/preview/{id}
                                    </span>
                                </div>

                                <ExternalLink
                                    size={13}
                                    className="text-[var(--text-muted)]"
                                />
                            </div>
                        )}

                        {/* Actual website */}
                        <iframe
                            ref={iframeRef}
                            title="Live Website Preview"
                            className="h-full w-full border-0 bg-white"
                            sandbox="allow-scripts allow-forms allow-modals allow-popups"

                        />
                    </div>
                </div>

                {/* =======================================================
            MONACO CODE EDITOR
        ======================================================= */}
                <AnimatePresence>
                    {showCode && (
                        <>
                            {/* Desktop/mobile overlay */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowCode(false)}
                                className="absolute inset-0 z-90 bg-black/60 backdrop-blur-sm"
                            />

                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeOut",
                                }}
                                className="absolute inset-y-0 right-0 z-100 flex w-full flex-col border-l border-[var(--border-primary)] bg-[var(--bg-card)] shadow-2xl sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[65%]"
                            >
                                {/* Code header */}
                                <div className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 sm:px-4">
                                    <div className="flex items-center gap-2">
                                        <Code2 size={16} className="text-[var(--text-muted)]" />

                                        <span className="text-sm font-medium text-[var(--text-primary)]">
                                            index.html
                                        </span>

                                        <span className="hidden rounded border border-[var(--border-primary)] bg-[var(--hover-bg-strong)] px-2 py-0.5 text-[10px] text-[var(--text-muted)] sm:block">
                                            HTML
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => setShowCode(false)}
                                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--hover-bg-strong)] hover:text-[var(--text-primary)]"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Monaco */}
                                <div className="min-h-0 flex-1">
                                    <Editor
                                        theme={theme === "dark" ? "vs-dark" : "light"}
                                        value={code}
                                        language="html"
                                        onChange={(value) => {
                                            setCode(value || "");
                                        }}
                                        options={{
                                            minimap: {
                                                enabled: false,
                                            },
                                            fontSize: 13,
                                            wordWrap: "on",
                                            automaticLayout: true,
                                            scrollBeyondLastLine: false,
                                            padding: {
                                                top: 12,
                                            },
                                            smoothScrolling: true,
                                            cursorBlinking: "smooth",
                                            formatOnPaste: true,
                                            formatOnType: true,
                                            tabSize: 2,
                                        }}
                                    />
                                </div>

                                {/* Editor footer */}
                                <div className="flex h-8 shrink-0 items-center justify-between border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 text-[10px] text-[var(--text-muted)]">
                                    <span>HTML</span>

                                    <span>
                                        {code.length.toLocaleString()} characters
                                    </span>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </main>

            {/* =========================================================
          MOBILE CHAT DRAWER
      ========================================================= */}
            <AnimatePresence>
                {showMobileChat && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMobileChat(false)}
                            className="fixed inset-0 z-150 bg-black/70 backdrop-blur-sm lg:hidden"
                        />

                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{
                                duration: 0.28,
                                ease: "easeOut",
                            }}
                            className="fixed inset-y-0 left-0 z-160 flex w-[88%] max-w-[420px] flex-col border-r border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-2xl lg:hidden"
                        >
                            <ChatHeader
                                website={wesbsite}
                                onClose={() => setShowMobileChat(false)}
                            />

                            <ChatContent
                                message={message}
                                updateLoading={updateLoading}
                                thinkingIndex={thinkingIndex}
                                thinkingSteps={thinkingSteps}
                                prompt={prompt}
                                setPrompt={setPrompt}
                                handleUpdateWesbsite={handleUpdateWesbsite}
                                handleKeyDown={handleKeyDown}
                                inputRef={chatInputRef}
                            />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

/* =============================================================
   CHAT HEADER
============================================================= */

const ChatHeader = ({ website, onClose }) => {
    return (
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border-primary)] px-3 sm:h-16 sm:px-4">
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-sm">
                    <MessageCircle size={18} />
                </div>

                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                        AI Assistant
                    </p>

                    <p className="truncate text-[11px] text-[var(--text-muted)]">
                        {website?.title || "Website Builder"}
                    </p>
                </div>
            </div>

            <button
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--hover-bg-strong)] hover:text-[var(--text-primary)]"
            >
                <X size={18} />
            </button>
        </div>
    );
};

/* =============================================================
   CHAT CONTENT
============================================================= */

const ChatContent = ({
    message,
    updateLoading,
    thinkingIndex,
    thinkingSteps,
    prompt,
    setPrompt,
    handleUpdateWesbsite,
    handleKeyDown,
    inputRef,
}) => {
    return (
        <div className="flex min-h-0 flex-1 flex-col">
            {/* Messages */}
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4">
                <div className="space-y-3">
                    {message.length === 0 && (
                        <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-sm">
                                <MessageCircle size={22} />
                            </div>

                            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                                What would you like to change?
                            </h3>

                            <p className="mt-2 max-w-[260px] text-xs leading-5 text-[var(--text-muted)]">
                                Tell the AI what you want to change in your
                                website and it will update the code for you.
                            </p>
                        </div>
                    )}

                    {message.map((msg, index) => (
                        <motion.div
                            key={`${index}-${msg.role}`}
                            initial={{
                                opacity: 0,
                                y: 8,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className={`flex ${msg.role === "user"
                                ? "justify-end"
                                : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${msg.role === "user"
                                    ? "rounded-br-md bg-[var(--btn-chat-bg)] text-[var(--btn-primary-text)] shadow-sm"
                                    : "rounded-bl-md border border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}

                    {/* AI Thinking */}
                    <AnimatePresence>
                        {updateLoading && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 8,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -5,
                                }}
                                className="flex justify-start"
                            >
                                <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-[var(--border-primary)] bg-[var(--bg-card)] px-3.5 py-2.5 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.3s]" />

                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.15s]" />

                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400" />
                                        </div>

                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={thinkingIndex}
                                                initial={{
                                                    opacity: 0,
                                                    y: 5,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: -5,
                                                }}
                                                transition={{
                                                    duration: 0.2,
                                                }}
                                                className="text-xs text-[var(--text-muted)]"
                                            >
                                                {thinkingSteps[thinkingIndex]}
                                            </motion.span>
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 sm:p-4">
                <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-1.5 transition focus-within:border-[var(--border-hover)]">
                    <div className="flex items-end gap-2">
                        <textarea
                            ref={inputRef}
                            rows={1}
                            value={prompt}
                            disabled={updateLoading}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Describe what you want to change..."
                            className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2.5 py-2.5 text-sm leading-5 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed disabled:opacity-50"
                        />

                        <button
                            onClick={handleUpdateWesbsite}
                            disabled={
                                updateLoading || !prompt.trim()
                            }
                            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Send size={16} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between px-2 pb-1 pt-1">
                        <span className="text-[10px] text-[var(--text-muted)]">
                            Enter to send
                        </span>

                        {updateLoading && (
                            <span className="text-[10px] font-medium text-violet-500">
                                AI is working...
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorPage;