import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Sparkles, Blocks, Rocket } from "lucide-react";

const steps = [
  {
    icon: Blocks,
    title: "Design Your Marketplace",
    description: "Drag and drop components to build your RWA marketplace. No code required.",
    color: "text-[var(--primary)]",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Building",
    description: "Use AI to generate smart contracts, suggest optimizations, and build faster.",
    color: "text-[var(--success)]",
  },
  {
    icon: Rocket,
    title: "Deploy to Polygon",
    description: "One-click deployment to Polygon Amoy testnet with automatic contract verification.",
    color: "text-[var(--warning)]",
  },
];

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  if (!isOpen) return null;

  const CurrentIcon = steps[currentStep].icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md surface-elevated rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <span className="text-sm font-medium text-[var(--text-primary)]">
                Welcome to RealFlow Studio
              </span>
              <button
                onClick={handleClose}
                className="p-1 rounded-md hover:bg-[var(--surface-hover)] transition-colors"
              >
                <X className="w-4 h-4 text-[var(--text-muted)]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="text-center"
                >
                  <div className={`inline-flex p-4 rounded-xl bg-[var(--surface)] mb-6`}>
                    <CurrentIcon className={`w-8 h-8 ${steps[currentStep].color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                    {steps[currentStep].title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {steps[currentStep].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 mt-8">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentStep
                        ? "bg-[var(--primary)] w-6"
                        : "bg-[var(--border-strong)]"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-[var(--border)]">
              <button
                onClick={handleClose}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="btn-primary flex items-center gap-2"
              >
                {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
