import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left — brand */}
      <div className="hidden lg:flex flex-1 items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-[280px] font-black text-primary select-none leading-none"
        >
          𝕏
        </motion.span>
      </div>

      {/* Right — CTA */}
      <div className="flex-1 flex items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-md w-full"
        >
          <h1 className="text-6xl sm:text-7xl font-black text-foreground tracking-tight leading-none mb-8">
            Happening now
          </h1>
          <p className="text-2xl sm:text-3xl font-bold text-foreground mb-10">
            Join Xitter today.
          </p>

          <div className="space-y-4 max-w-sm">
            <button
              onClick={() => navigate(user ? "/feed" : "/auth")}
              className="w-full bg-primary text-primary-foreground font-bold text-base py-3 rounded-full hover:bg-primary/90 transition-colors"
            >
              {user ? "Go to Feed" : "Create account"}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-muted-foreground text-sm">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button
              onClick={() => navigate("/auth")}
              className="w-full border border-border text-foreground font-bold text-base py-3 rounded-full hover:bg-secondary transition-colors"
            >
              Sign in
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-6 leading-relaxed max-w-xs">
            By signing up, you agree to the Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
