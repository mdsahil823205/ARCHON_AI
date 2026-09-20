import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useParams } from "react-router-dom";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Globe,
  ArrowLeft,
} from "lucide-react";
import { motion } from "motion/react";

const LiveSite = () => {
  const { slug } = useParams();

  const [html, setHtml] = useState("");
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleGetWebsite = useCallback(async () => {
    if (!slug) {
      setError("Invalid website URL.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await axios.get(
        `${serverUrl}/api/website/get-by-slug/${encodeURIComponent(slug)}`
      );

      const websiteData = result?.data?.website;

      if (!websiteData?.latestCode) {
        throw new Error("Website content is not available.");
      }

      setWebsite(websiteData);
      setHtml(websiteData.latestCode);
    } catch (error) {
      console.log("Error while getting website:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load this website.";

      setError(message);
      setHtml("");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    handleGetWebsite();
  }, [handleGetWebsite]);

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col items-center"
        >
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20">
            <div className="absolute inset-0 rounded-2xl bg-blue-500/10 blur-xl" />

            <Loader2 className="relative h-6 w-6 animate-spin text-blue-400" />
          </div>

          <p className="mt-5 text-sm font-medium text-white">
            Loading website
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Preparing your live experience...
          </p>

          <div className="mt-5 h-1 w-40 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-blue-500"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111216] p-7 text-center shadow-2xl shadow-black/40"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
            <AlertCircle className="h-6 w-6 text-red-400" />
          </div>

          <h1 className="mt-5 text-lg font-semibold text-white">
            Website unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {error}
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={handleGetWebsite}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 active:scale-[0.98]"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.05] hover:text-white active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" />
              Go back
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* =========================================
     LIVE WEBSITE
  ========================================= */

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white">
      {/* Minimal browser-like top bar */}
      <header className="flex h-10 shrink-0 items-center justify-between border-b border-zinc-200 bg-zinc-50 px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-900">
            <Globe className="h-3.5 w-3.5 text-white" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-zinc-700">
              {website?.title || "Live Website"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

          <span className="text-[10px] font-medium text-emerald-700 sm:text-[11px]">
            Live
          </span>
        </div>
      </header>

      {/* Website iframe */}
      <main className="min-h-0 flex-1 bg-white">
        <iframe
          title={website?.title || "Live Website"}
          srcDoc={html}
          frameBorder="0"
          sandbox="allow-scripts allow-forms allow-modals allow-popups"
          className="block h-full w-full border-0 bg-white"
        />
      </main>
    </div>
  );
};

export default LiveSite;