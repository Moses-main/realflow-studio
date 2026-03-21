import { motion } from "framer-motion";

export function IsometricFeatures() {
  return (
    <section className="py-24 px-6 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
          
          {/* FIG 0.2: Built for purpose */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col group"
          >
            <div className="text-[10px] tracking-widest text-zinc-600 font-mono mb-6 uppercase">Fig 0.2</div>
            <div className="flex-1 min-h-[280px] flex items-center justify-center relative mb-8">
              {/* Stacked Isometric Squares */}
              <svg viewBox="0 0 200 240" className="w-full h-full max-w-[200px] text-zinc-500 overflow-visible">
                <g transform="translate(100, 140) scale(1.2)">
                  {/* Base layers (outlines) */}
                  {[...Array(5)].map((_, i) => (
                    <motion.path
                      key={`layer-${i}`}
                      d="M 0 0 L 50 -25 L 0 -50 L -50 -25 Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      initial={{ y: (4 - i) * -10, opacity: 1 - (4 - i) * 0.15 }}
                      whileHover={{ y: (4 - i) * -15 }}
                      transition={{ duration: 0.4 }}
                    />
                  ))}
                  
                  {/* Top filled layer */}
                  <motion.g 
                    initial={{ y: -60 }}
                    whileHover={{ y: -70 }}
                    transition={{ duration: 0.4 }}
                  >
                    <path d="M 0 0 L 50 -25 L 0 -50 L -50 -25 Z" fill="#0a0a0a" stroke="currentColor" strokeWidth="0.5" />
                    {/* Circle / Horizon graphic */}
                    <g transform="translate(0, -25) scale(0.6)">
                      <ellipse cx="0" cy="0" rx="30" ry="15" fill="none" stroke="currentColor" strokeWidth="1" />
                      <path d="M -25 -5 L 25 -5 M -28 0 L 28 0 M -25 5 L 25 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    </g>
                    {/* Dotted projection lines */}
                    <path d="M -50 -25 L -50 25 M 50 -25 L 50 25 M 0 0 L 0 50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
                  </motion.g>
                </g>
              </svg>
            </div>
            <h3 className="text-white text-base font-medium mb-3">Built for purpose</h3>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
              RealFlow is shaped by the practices and principles of world-class product teams.
            </p>
          </motion.div>

          {/* FIG 0.3: Powered by AI agents */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col group pr-4 md:border-l border-white/5 md:pl-8 lg:pl-12"
          >
            <div className="text-[10px] tracking-widest text-zinc-600 font-mono mb-6 uppercase">Fig 0.3</div>
            <div className="flex-1 min-h-[280px] flex items-center justify-center relative mb-8">
              {/* Grouped 3D Cubes */}
              <svg viewBox="0 0 200 240" className="w-full h-full max-w-[200px] text-zinc-500 overflow-visible">
                <g transform="translate(100, 160) scale(0.9)">
                  
                  {/* Cube 1 (Back Right) */}
                  <g transform="translate(40, -40)">
                    <path d="M 0 -20 L 30 -35 L 0 -50 L -30 -35 Z" fill="#0a0a0a" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M -30 -35 L -30 15 L 0 30 L 0 -20 Z" fill="#0a0a0a" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M 0 -20 L 0 30 L 30 15 L 30 -35 Z" fill="#0a0a0a" stroke="currentColor" strokeWidth="0.5" />
                  </g>

                  {/* Cube 2 (Left Tall) */}
                  <g transform="translate(-30, -10)">
                    <path d="M 0 -40 L 40 -60 L 0 -80 L -40 -60 Z" fill="#0a0a0a" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M -40 -60 L -40 20 L 0 40 L 0 -40 Z" fill="#0a0a0a" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M 0 -40 L 0 40 L 40 20 L 40 -60 Z" fill="#0a0a0a" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M -10 -65 L -5 -65 M -10 -60 L -5 -60" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  </g>

                  {/* Cube 3 (Back Top) */}
                  <motion.g 
                    transform="translate(15, -75)"
                    whileHover={{ y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <path d="M 0 -25 L 25 -37.5 L 0 -50 L -25 -37.5 Z" fill="#0a0a0a" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M -25 -37.5 L -25 12.5 L 0 25 L 0 -25 Z" fill="#0a0a0a" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M 0 -25 L 0 25 L 25 12.5 L 25 -37.5 Z" fill="#0a0a0a" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M -5 -35 L 0 -35 M -5 -30 L 0 -30 M -5 -25 L 0 -25" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  </motion.g>

                  {/* Cube 4 (Front Small) */}
                  <g transform="translate(15, 25)">
                    <path d="M 0 -20 L 25 -32.5 L 0 -45 L -25 -32.5 Z" fill="#0a0a0a" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M -25 -32.5 L -25 10 L 0 22.5 L 0 -20 Z" fill="#0a0a0a" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M 0 -20 L 0 22.5 L 25 10 L 25 -32.5 Z" fill="#0a0a0a" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="-5" cy="-28" r="1.5" fill="currentColor" />
                  </g>

                </g>
              </svg>
            </div>
            <h3 className="text-white text-base font-medium mb-3">Powered by AI agents</h3>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
              Designed for workflows shared by humans and agents. From drafting PRDs to pushing PRs.
            </p>
          </motion.div>

          {/* FIG 0.4: Designed for speed */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col group pr-4 md:border-l border-white/5 md:pl-8 lg:pl-12"
          >
            <div className="text-[10px] tracking-widest text-zinc-600 font-mono mb-6 uppercase">Fig 0.4</div>
            <div className="flex-1 min-h-[280px] flex items-center justify-center relative mb-8 overflow-hidden">
              {/* Accelerating Plates */}
              <svg viewBox="0 0 200 240" className="w-full h-full max-w-[200px] text-zinc-500 overflow-visible">
                <g transform="translate(10, 160)">
                  {[...Array(15)].map((_, i) => {
                    const progress = i / 14;
                    const height = 20 + Math.pow(progress, 2) * 100;
                    const xOffset = Math.pow(progress, 1.5) * 120;
                    const yOffset = -xOffset * 0.5;
                    
                    return (
                      <motion.g 
                        key={`plate-${i}`} 
                        transform={`translate(${xOffset}, ${yOffset})`}
                        initial={{ opacity: 0, x: -20, y: 10 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                      >
                        <path 
                          d={`M 0 0 L 10 -5 L 10 -${height + 5} L 0 -${height} Z`} 
                          fill="#0a0a0a" 
                          stroke="currentColor" 
                          strokeWidth="0.5" 
                        />
                        <path 
                          d={`M 0 -${height} L 10 -${height + 5} L -10 -${height - 5} L -20 -${height - 10} Z`} 
                          fill="none" 
                          stroke="transparent" 
                        />
                      </motion.g>
                    );
                  })}
                </g>
              </svg>
            </div>
            <h3 className="text-white text-base font-medium mb-3">Designed for speed</h3>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
              Reduces noise and restores momentum to help teams ship with high velocity and focus.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
