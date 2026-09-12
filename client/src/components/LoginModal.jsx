import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { X, ShieldCheck } from "lucide-react";
import { auth, googleProvider } from "../utils/FirebaseAuth";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const LoginModal = ({ open, onClose }) => {
  const dispatch = useDispatch()
  const googleAuthentication = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;

      const { data } = await axios.post(
        `${serverUrl}/api/auth/google`,
        {
          email: user.email,
          name: user.displayName,
          avatar: user.photoURL,
        },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        dispatch(setUserData(data.user));
        onClose();
      }
    } catch (error) {
      console.log("Google authentication error:", error);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl sm:p-8"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-white/5 hover:text-white"
            >
              <X size={18} />
            </button>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-bold text-black">
                W
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-5 text-center"
            >
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Welcome to{" "}
                <span className="text-violet-400">webGenAI</span>
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Create beautiful websites with the power of AI.
              </p>
            </motion.div>

            {/* Google Login */}
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={googleAuthentication}
              className="mt-7 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-gray-100"
            >
              <FcGoogle size={20} />
              Continue with Google
            </motion.button>

            {/* Security */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-5 flex items-center justify-center gap-1.5 text-xs text-gray-600"
            >
              <ShieldCheck size={14} />
              Secure authentication
            </motion.div>

            {/* Terms */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-5 text-center text-[11px] leading-5 text-gray-600"
            >
              By continuing, you agree to our{" "}
              <span className="cursor-pointer text-gray-400 hover:text-white">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="cursor-pointer text-gray-400 hover:text-white">
                Privacy Policy
              </span>
              .
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;