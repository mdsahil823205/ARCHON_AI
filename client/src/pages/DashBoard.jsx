import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  ExternalLink,
  Rocket,
  Share2,
  MoreHorizontal,
  Globe,
  RefreshCw,
  LayoutDashboard,
  Check,
} from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";

const DashBoard = () => {
  const { userData } = useSelector((state) => state.userDetails);

  const navigate = useNavigate();

  const [websiteData, setWebsiteData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [copiedId, setCopiedId] = useState(null);
  const [deployingId, setDeployingId] = useState(null);
  // =========================================================
  // GET ALL WEBSITES
  // =========================================================
  const handleGetAllWebsite = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await axios.get(`${serverUrl}/api/website/all-website`, {
        withCredentials: true,
      });

      /*
       * Keeping the response flexible in case backend returns:
       * - array directly
       * - { websites: [] }
       * - { website: [] }
       */
      const data =
        result?.data?.websites ?? result?.data?.website ?? result?.data ?? [];

      setWebsiteData(Array.isArray(data) ? data : []);

      console.log("Websites:", data);
    } catch (error) {
      console.log("Error while getting websites:", error);

      setError(
        error?.response?.data?.message ||
        "Unable to load your websites. Please try again.",
      );

      setWebsiteData([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================
  useEffect(() => {
    handleGetAllWebsite();
  }, []);

  // =========================================================
  // FORMAT DATE
  // =========================================================
  const formatDate = (date) => {
    if (!date) return "Unknown";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };


  const handleDeploy = async (id) => {
    try {
      setDeployingId(id);

      const result = await axios.get(
        `${serverUrl}/api/website/deploy/${id}`,
        {
          withCredentials: true,
        }
      );

      if (result?.data?.success) {
        const url = result.data.url;

        // Update card immediately
        setWebsiteData((prev) =>
          prev.map((website) =>
            website._id === id
              ? {
                ...website,
                deployed: true,
                deployUrl: url,
              }
              : website
          )
        );

        window.open(url, "_blank");
      }
    } catch (error) {
      console.log("Deploy error:", error);

      const message =
        error?.response?.data?.message ||
        "Failed to deploy website.";

      console.error(message);
    } finally {
      setDeployingId(null);
    }
  };

  const handleShare = async (site) => {
    if (!site?.deployUrl) return;

    try {
      await navigator.clipboard.writeText(site.deployUrl);

      setCopiedId(site._id);

      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (error) {
      console.log("Copy error:", error);
    }
  };
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#09090b] text-white">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#09090b]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:min-h-[68px] sm:px-6 lg:px-8">
          {/* LEFT */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            {/* Back */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="group flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2 text-sm font-medium text-gray-400 transition-all hover:bg-white/[0.05] hover:text-white sm:px-3"
            >
              <ArrowLeft
                size={17}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />

              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="h-5 w-px bg-white/10" />

            {/* Dashboard title */}
            <div className="flex min-w-0 items-center gap-2">
              <div className="hidden h-8 w-8 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/[0.08] text-blue-400 sm:flex">
                <LayoutDashboard size={16} />
              </div>

              <h1 className="truncate text-sm font-semibold tracking-tight sm:text-base">
                Dashboard
              </h1>
            </div>
          </div>

          {/* RIGHT */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/generate")}
            className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 text-xs font-semibold text-black shadow-lg shadow-blue-500/10 transition-all hover:bg-[#f4f1f1] sm:h-10 sm:px-4 sm:text-sm"
          >
            <Plus size={16} />

            <span className="hidden sm:inline">New Website</span>

            <span className="sm:hidden">New</span>
          </motion.button>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}
      <main className="relative min-h-[calc(100vh-68px)] overflow-hidden">
        {/* Subtle background lights */}
        <div className="pointer-events-none absolute left-1/2 top-[-220px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-500/[0.06] blur-[120px]" />

        <div className="pointer-events-none absolute right-[-180px] top-[35%] h-[300px] w-[300px] rounded-full bg-violet-500/[0.035] blur-[110px]" />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          {/* =================================================
              PAGE INTRO
          ================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              ease: "easeOut",
            }}
            className="mb-8 sm:mb-10"
          >
            <p className="text-sm font-medium text-blue-400">Your workspace</p>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="break-words text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
                  Welcome back
                  {userData?.name ? (
                    <span className="text-gray-400">, {userData.name}</span>
                  ) : null}
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                  Manage your generated websites and continue building from
                  where you left off.
                </p>
              </div>

              {/* Refresh */}
              <button
                type="button"
                onClick={handleGetAllWebsite}
                disabled={loading}
                className="flex h-9 w-fit cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs font-medium text-gray-400 transition-all hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </motion.div>

          {/* =================================================
              LOADING
          ================================================== */}
          {loading && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111216]"
                >
                  {/* Preview skeleton */}
                  <div className="h-52 animate-pulse bg-[#18191d] sm:h-56" />

                  {/* Content skeleton */}
                  <div className="space-y-4 p-5">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-white/[0.07]" />

                    <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.05]" />

                    <div className="flex gap-2">
                      <div className="h-9 flex-1 animate-pulse rounded-lg bg-white/[0.05]" />
                      <div className="h-9 w-10 animate-pulse rounded-lg bg-white/[0.05]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================== */}
          {!loading && error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-red-500/15 bg-red-500/[0.03] px-5 text-center"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/[0.08] text-red-400">
                !
              </div>

              <h2 className="text-base font-semibold text-white">
                Unable to load websites
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                {error}
              </p>

              <button
                type="button"
                onClick={handleGetAllWebsite}
                className="mt-5 flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </motion.div>
          )}

          {/* =================================================
              EMPTY STATE
          ================================================== */}
          {!loading && !error && websiteData.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-5 text-center"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/[0.08] text-blue-400">
                <Globe size={24} />
              </div>

              <h2 className="text-lg font-semibold text-white">
                No websites yet
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                Create your first website with AI and it will appear here.
              </p>

              <button
                type="button"
                onClick={() => navigate("/generate")}
                className="mt-6 flex cursor-pointer items-center gap-2 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition-all hover:bg-blue-400"
              >
                <Plus size={16} />
                Create Website
              </button>
            </motion.div>
          )}

          {/* =================================================
              WEBSITE GRID
          ================================================== */}

          {!loading && !error && websiteData.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-3">
              {websiteData.map((web, index) => (
                <motion.article
                  key={web?._id || web?.id || index}

                  initial={{
                    opacity: 0,
                    y: 14,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.35,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    y: -3,
                  }}
                  className="group min-w-0 overflow-hidden rounded-md border border-white/[0.08] bg-[#111216] transition-all duration-300 hover:border-blue-500/20 hover:shadow-xl hover:shadow-black/30 sm:rounded-xl"
                >
                  {/* =================================================
            WEBSITE PREVIEW
        ================================================== */}
                  <div className="relative aspect-[4/2] w-full overflow-hidden border-b border-white/[0.08] bg-white">
                    {/* Browser bar */}
                    <div className="absolute left-0 right-0 top-0 z-10 flex h-5 items-center gap-1 border-b border-gray-200 bg-gray-50 px-1.5 sm:h-6 sm:px-2 md:h-7 md:px-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400 sm:h-2 sm:w-2" />
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 sm:h-2 sm:w-2" />
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400 sm:h-2 sm:w-2" />

                      <div className="ml-1 flex h-3 min-w-0 flex-1 items-center rounded bg-white px-1 sm:ml-1.5 sm:h-4 sm:px-2">
                        <span className="truncate text-[5px] text-gray-400 sm:text-[7px] md:text-[8px]">
                          Website Preview
                        </span>
                      </div>
                    </div>

                    {/* Website */}
                    {web?.latestCode ? (
                      <iframe
                        srcDoc={web.latestCode}
                        title={web.title || "Website Preview"}
                        frameBorder="0"
                        sandbox="allow-scripts allow-forms allow-modals allow-popups"
                        className="cursor-pointer h-full w-full border-0 bg-white pt-5 sm:pt-6 md:pt-7"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-2 pt-5 text-center text-[8px] text-gray-400 sm:pt-6 sm:text-[10px] md:pt-7 md:text-xs">
                        No preview
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-black/[0.03] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {/* =================================================
            CARD CONTENT
        ================================================== */}
                  <div className="p-2 sm:p-3 md:p-4">
                    {/* Title */}
                    <div className="cursor-pointer flex min-w-0 items-start justify-between gap-1 sm:gap-2"
                      onClick={() => navigate(`/editor/${web._id}`)}>
                      <div className="min-w-0 flex-1">
                        <h2 className="truncate text-[10px] font-semibold leading-4 text-white sm:text-xs md:text-sm">
                          {web?.title || "Untitled Website"}
                        </h2>

                        <p className="mt-0.5 truncate text-[7px] text-gray-600 sm:text-[9px] md:text-[10px]">
                          {formatDate(web?.updateDateAt)}
                        </p>
                      </div>

                      {/* More */}
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-white/[0.06] hover:text-white sm:h-6 sm:w-6"
                        title="More options"
                      >
                        <MoreHorizontal
                          size={12}
                          className="sm:h-[14px] sm:w-[14px]"
                        />
                      </button>
                    </div>

                    {/* Status */}
                    <div className="mt-2 sm:mt-3">
                      {web?.deployed ? (
                        <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-emerald-500/15 bg-emerald-500/[0.07] px-1.5 py-0.5 text-[6px] font-medium text-emerald-400 sm:px-2 sm:py-1 sm:text-[8px] md:text-[9px]">
                          <span className="h-1 w-1 shrink-0 rounded-full bg-emerald-400 sm:h-1.5 sm:w-1.5" />

                          <span className="truncate">
                            Deployed
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-amber-500/15 bg-amber-500/[0.07] px-1.5 py-0.5 text-[6px] font-medium text-amber-400 sm:px-2 sm:py-1 sm:text-[8px] md:text-[9px]">
                          <span className="h-1 w-1 shrink-0 rounded-full bg-amber-400 sm:h-1.5 sm:w-1.5" />

                          <span className="truncate">
                            Not deployed
                          </span>
                        </span>
                      )}
                    </div>

                    {/* =================================================
              ACTIONS
          ================================================== */}
                    <div className="mt-2 flex gap-1 sm:mt-3 sm:gap-1.5">
                      {!web?.deployed ? (
                        /* ================= DEPLOY ================= */
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeploy(web._id);
                          }}
                          type="button"
                          disabled={deployingId === web._id}
                          className="flex h-7 min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 rounded-md bg-blue-500 px-1 text-[7px] font-semibold text-white transition-colors hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60 sm:h-8 sm:gap-1.5 sm:rounded-lg sm:text-[9px] md:h-9 md:text-[10px]"
                        >
                          <Rocket
                            size={10}
                            className={`shrink-0 sm:h-3 sm:w-3 ${deployingId === web._id ? "animate-pulse" : ""
                              }`}
                          />

                          <span className="truncate">
                            {deployingId === web._id ? "Deploying..." : "Deploy"}
                          </span>
                        </button>
                      ) : (
                        /* ================= SHARE ================= */
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(web);
                          }}
                          type="button"
                          className="flex h-7 min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 rounded-md bg-white px-1 text-[7px] font-semibold text-black transition-colors hover:bg-gray-200 sm:h-8 sm:gap-1.5 sm:rounded-lg sm:text-[9px] md:h-9 md:text-[10px]"
                          title="Copy deployed website URL"
                        >
                          {copiedId === web._id ? (
                            <Check
                              size={10}
                              className="shrink-0 text-emerald-600 sm:h-3 sm:w-3"
                            />
                          ) : (
                            <Share2
                              size={10}
                              className="shrink-0 sm:h-3 sm:w-3"
                            />
                          )}

                          <span className="truncate">
                            {copiedId === web._id ? "Copied" : "Share"}
                          </span>
                        </button>
                      )}

                      {/* Open Editor */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/editor/${web._id}`);
                        }}
                        type="button"
                        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-gray-500 transition-colors hover:bg-white/[0.07] hover:text-white sm:h-8 sm:w-8 sm:rounded-lg md:h-9 md:w-9"
                        title="Open website"
                      >
                        <ExternalLink
                          size={10}
                          className="sm:h-3 sm:w-3 md:h-[14px] md:w-[14px]"
                        />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default DashBoard;
