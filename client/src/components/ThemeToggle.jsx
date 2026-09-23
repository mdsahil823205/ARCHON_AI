import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[var(--border-primary)] bg-[var(--hover-bg)] text-[var(--text-muted)] transition-colors duration-200 hover:bg-[var(--hover-bg-strong)] hover:text-[var(--text-primary)]"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {isDark ? <Sun size={17} /> : <Moon size={17} />}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
