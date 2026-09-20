import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, WandSparkles, AlertCircle } from "lucide-react";
import axios from "axios";
import { serverUrl } from "../App";

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

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

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
    },700);

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
  // Generate website
  // ---------------------------------------------------------
  const handleGenerateWebsite = async () => {
    if (loading) return;
    try {
      setLoading(true);
      setErrorMessage("");
      setProgress(0);
      setCurrentStep(0);

      const result = await axios.post(
        `${serverUrl}/api/website/generate`, { prompt },
        {
          withCredentials: true,
        },
      );

      console.log("Website generation response:", result);

      // Your actual API response:
      // result.data.website._id
      const websiteId = result?.data?.website?._id;

      if (!websiteId) {
        throw new Error(
          "Website was generated, but the website ID was not received.",
        );
      }

      // API successfully completed.
      // Go directly to editor with generated website ID.
      navigate(`/editor/${websiteId}`);
    } catch (error) {
      console.error("Website generation error:", error);

      let message = "Something went wrong while generating your website.";

      // Axios error
      if (axios.isAxiosError(error)) {
        // Server responded with an error
        if (error.response) {
          message =
            error.response.data?.message ||
            error.response.data?.error ||
            `Request failed with status ${error.response.status}.`;
        }

        // Request was sent but server did not respond
        else if (error.request) {
          message =
            "Unable to connect to the server. Please check your connection and try again.";
        }

        // Something went wrong while creating request
        else {
          message = error.message || message;
        }
      }

      // Normal JavaScript error
      else if (error instanceof Error) {
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
    <div className="min-h-screen w-full overflow-x-hidden bg-[#0a0a0a] text-white">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="border-b border-white/[0.08] bg-[#0a0a0a]">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between px-4 sm:min-h-[68px] sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => navigate("/")}
              disabled={loading}
              className="group flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2.5 text-sm text-gray-400 transition-colors hover:bg-white/[0.05] hover:text-white disabled:pointer-events-none disabled:opacity-50"
            >
              <ArrowLeft
                size={17}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />

              <span>Back</span>
            </button>

            <div className="h-5 w-px bg-white/10" />

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-black">
                <Sparkles size={14} />
              </div>

              <h1 className="text-sm font-semibold tracking-tight sm:text-base">
                WebGen
              </h1>
            </div>
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
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-400">
              <Sparkles size={13} />

              <span>AI Website Builder</span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Build your website
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Describe what you want to build and let WebGen create the website
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
            {/* Section title */}
            <div className="mb-3 flex items-center gap-2">
              <WandSparkles size={17} className="text-gray-400" />

              <h2 className="text-sm font-medium text-gray-200">
                Describe your website
              </h2>
            </div>

            {/* Main Input Card */}
            <div className="rounded-xl border border-white/10 bg-[#111111] p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:p-3">
              {/* =================================================
                  PROGRESS BAR
                  Shows above textarea
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
                    <div className="mb-3 rounded-lg border border-white/[0.07] bg-[#0a0a0a] px-3.5 py-3 sm:px-4">
                      {/* Progress Header */}
                      <div className="mb-2.5 flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.06]">
                            <Sparkles
                              size={14}
                              className="animate-pulse text-gray-300"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-300">
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
                                className="mt-0.5 truncate text-[11px] text-gray-600"
                              >
                                {thinkingSteps[currentStep]}
                              </motion.p>
                            </AnimatePresence>
                          </div>
                        </div>

                        <span className="shrink-0 text-xs font-medium tabular-nums text-gray-500">
                          {Math.floor(progress)}%
                        </span>
                      </div>

                      {/* Progress Track */}
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div
                          className="h-full rounded-full bg-white"
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
                        <AlertCircle size={14} className="text-red-400" />
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
                className="min-h-44 w-full resize-none rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-4 py-3.5 text-sm leading-6 text-white outline-none transition-colors placeholder:text-gray-600 focus:border-white/20 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-52 sm:px-5 sm:py-4 sm:text-base"
              />

              {/* =================================================
                  BOTTOM CONTROLS
              ================================================== */}
              <div className="flex flex-col gap-3 px-1 pt-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="hidden text-xs text-gray-600 sm:block">
                  Be as specific as possible for better results.
                </p>

                <motion.button
                  type="button"
                  onClick={handleGenerateWebsite}
                  disabled={!prompt.trim() || loading}
                  whileHover={{
                    scale: !prompt.trim() || loading ? 1 : 1.01,
                  }}
                  whileTap={{
                    scale: !prompt.trim() || loading ? 1 : 0.98,
                  }}
                  className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-medium text-black transition-all duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-gray-600 sm:w-auto"
                >
                  <Sparkles
                    size={16}
                    className={loading ? "animate-pulse" : ""}
                  />

                  {loading ? "Generating..." : "Generate Website"}
                </motion.button>
              </div>
            </div>

            {/* Small info */}
            <p className="mt-3 px-1 text-xs text-gray-600">
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
              <p className="mb-3 text-xs font-medium text-gray-500">
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
                    className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-3 text-left text-xs text-gray-500 transition-colors hover:border-white/15 hover:bg-white/[0.04] hover:text-gray-300"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Generate;
