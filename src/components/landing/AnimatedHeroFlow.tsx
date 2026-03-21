import { motion } from "framer-motion";
import { LogIn, Blocks, Sparkles, Rocket, ArrowRightLeft } from "lucide-react";
import { useState, useEffect } from "react";

const steps = [
  { id: 1, title: "Login", icon: LogIn, x: 10, y: 50, color: "from-blue-500 to-cyan-400" },
  { id: 2, title: "Build", icon: Blocks, x: 30, y: 25, color: "from-indigo-500 to-purple-500" },
  { id: 3, title: "AI Assist", icon: Sparkles, x: 50, y: 75, color: "from-purple-500 to-pink-500" },
  { id: 4, title: "Deploy", icon: Rocket, x: 70, y: 35, color: "from-orange-500 to-red-500" },
  { id: 5, title: "Trade", icon: ArrowRightLeft, x: 90, y: 50, color: "from-emerald-400 to-teal-500" },
];

export function AnimatedHeroFlow() {
  const [activeStep, setActiveStep] = useState(0);

  // Auto-progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= steps.length ? 0 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const pathD = "M 10 50 C 20 50, 20 25, 30 25 C 40 25, 40 75, 50 75 C 60 75, 60 35, 70 35 C 80 35, 80 50, 90 50";

  return (
    <div className="w-full max-w-5xl mx-auto relative mt-16 px-4 hidden sm:block">
      <div className="relative w-full aspect-[21/9] rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] overflow-hidden shadow-2xl">
        
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          <path 
            d={pathD} 
            fill="none" 
            stroke="rgba(255,255,255,0.05)" 
            strokeWidth="0.4"
            vectorEffect="non-scaling-stroke"
          />
          
          <motion.path
            d={pathD}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: activeStep === 0 ? 0 : activeStep / steps.length }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 0 8px var(--primary))" }}
          />

          {activeStep > 0 && activeStep <= steps.length && (
            <motion.circle
              r="1"
              fill="white"
              style={{ filter: "drop-shadow(0 0 10px white)" }}
              initial={{ offsetDistance: `${(activeStep - 1) * 25}%` }}
              animate={{ offsetDistance: `${activeStep * 25}%` }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="motion-path-animate"
            >
              <animateMotion
                dur="1.5s"
                fill="freeze"
                path={pathD}
                keyPoints={`${(activeStep - 1) / 4};${activeStep / 4}`}
                keyTimes="0;1"
                calcMode="linear"
              />
            </motion.circle>
          )}
        </svg>

        {steps.map((step, index) => {
          const isActive = index < activeStep;
          
          return (
            <div
              key={step.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-10"
              style={{ left: `${step.x}%`, top: `${step.y}%` }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: isActive ? 1.1 : 1, 
                  opacity: isActive ? 1 : 0.5 
                }}
                transition={{ duration: 0.4 }}
                className={`relative flex items-center justify-center w-12 h-12 rounded-xl border border-white/10 bg-[var(--surface)] transition-all duration-500 ${isActive ? 'shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] border-[var(--primary)]' : ''}`}
              >
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${step.color} opacity-20 ${isActive ? 'animate-pulse' : 'hidden'}`} />
                
                <step.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-zinc-500'} relative z-10`} />
                
                {isActive && (
                  <motion.div 
                    layoutId="activeGlow"
                    className="absolute inset-0 rounded-xl ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--surface-elevated)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
              
              <motion.div 
                className={`text-sm font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-zinc-600'}`}
                animate={{ y: isActive ? 0 : 5, opacity: isActive ? 1 : 0.5 }}
              >
                {step.title}
              </motion.div>
            </div>
          );
        })}

        <div className="absolute top-4 left-4 flex flex-col gap-1.5 opacity-30">
          <div className="w-16 h-1 bg-[var(--primary)] rounded-full" />
          <div className="w-10 h-1 bg-[var(--primary)] rounded-full" />
          <div className="w-24 h-1 bg-[var(--primary)] rounded-full" />
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-20">
          <div className="w-12 h-12 rounded-lg border border-white/20 transform rotate-12" />
          <div className="w-12 h-12 rounded-lg border border-[var(--primary)] transform -rotate-6" />
        </div>

      </div>
    </div>
  );
}
