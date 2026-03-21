import { motion } from "framer-motion";
import { Circle, Briefcase, Bot, Smartphone, Globe, Flag, MessageSquare } from "lucide-react";

const initiatives = [
  {
    category: "Platform Core",
    icon: Circle,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    count: 99,
    children: [
      { name: "Smart Contract Engine", icon: Briefcase, count: 28, color: "text-cyan-500" },
      { name: "AI Co-Builder", icon: Bot, count: 16, color: "text-blue-400" },
      { name: "Fiat On-Ramp", icon: Smartphone, count: 8, color: "text-blue-500" },
    ]
  },
  {
    category: "Asset Classes",
    icon: Globe,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    count: 21,
    children: [
      { name: "Real Estate Tokens", icon: Flag, count: 12, color: "text-rose-600" },
      { name: "Digital Art & IP", icon: MessageSquare, count: 9, color: "text-pink-500" },
    ]
  }
];

const months = [
  { name: "FEB", days: [2, 9, 16, 23] },
  { name: "MAR", days: [2, 9, 16, 23] },
  { name: "APR", days: [30, 6, 13, 20] },
  { name: "MAY", days: [27, 4, 11, 18] },
  { name: "JUN", days: [25, 1, 8, 15] },
  { name: "JUL", days: [22, 29, 6, 13] },
  { name: "AUG", days: [20, 27, 3, 10] },
  { name: "SEP", days: [17, 24, 31, 7] },
];

export function InitiativesRoadmap() {
  return (
    <section className="py-24 px-6 bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
      
      {/* Top Header Logo matching design.png */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-zinc-500 text-sm font-mono flex items-center gap-2">
        <span>2.0</span>
        <span className="text-zinc-300">Plan &rarr;</span>
      </div>

      <div className="w-full max-w-[1200px] h-[600px] relative mt-12 bg-[#0a0a0a]">
        
        {/* The Grid / Timeline Header */}
        <div className="absolute top-0 left-[280px] right-0 h-16 flex border-b border-white/5">
          {months.map((month) => (
            <div key={month.name} className="flex-1 border-r border-white/5 flex flex-col justify-end pb-2">
              <div className="text-[10px] text-zinc-500 font-mono px-2 mb-1">{month.name}</div>
              <div className="flex w-full px-1">
                {month.days.map((day, i) => (
                  <div key={i} className="flex-1 text-center text-[9px] text-zinc-700">{day}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Global Vertical Grid Lines */}
        <div className="absolute top-16 bottom-0 left-[280px] right-0 flex pointer-events-none">
          {months.map((month, i) => (
            <div key={i} className="flex-1 border-r border-white-[0.02] flex">
              {[0, 1, 2, 3].map((j) => (
                <div key={j} className="flex-1 border-r border-white-[0.01]" />
              ))}
            </div>
          ))}
        </div>

        {/* Left Sidebar panel */}
        <div className="absolute top-16 left-0 w-[280px] bottom-0 bg-[#111111] rounded-xl border border-white/10 overflow-hidden z-20">
          <div className="h-12 flex items-center px-4 border-b border-white/5 text-xs text-zinc-400">
            Initiatives
          </div>
          
          <div className="p-2 space-y-6 overflow-y-auto max-h-full pb-20">
            {initiatives.map((group, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between px-2 py-2 rounded hover:bg-white/5 cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full ${group.bgColor} flex items-center justify-center`}>
                      <group.icon className={`w-3 h-3 ${group.color}`} />
                    </div>
                    <span className="text-sm text-zinc-200">{group.category}</span>
                  </div>
                  <span className="text-xs text-zinc-500 group-hover:text-zinc-400">{group.count}</span>
                </div>
                
                <div className="pl-6 relative">
                  <div className="absolute left-[21px] top-0 bottom-4 w-px bg-white/10" />
                  {group.children.map((child, j) => (
                    <div key={j} className="flex items-center justify-between px-2 py-2 rounded hover:bg-white/5 cursor-pointer group/item relative">
                      <div className="absolute left-[-5px] top-1/2 w-3 h-px bg-white/10" />
                      <div className="flex items-center gap-2 pl-2">
                        <child.icon className={`w-3 h-3 ${child.color}`} />
                        <span className="text-sm text-zinc-400 group-hover/item:text-zinc-200">{child.name}</span>
                      </div>
                      <span className="text-xs text-zinc-600 group-hover/item:text-zinc-400">{child.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Timeline Canvas Region */}
        <div className="absolute top-16 left-[280px] right-0 bottom-0 overflow-hidden">
          
          {/* Project 1: Visual Builder Polish */}
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "35%", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute top-12 left-[38%] h-7 z-10"
          >
            {/* Title above bar */}
            <div className="absolute -top-6 left-0 flex items-center gap-1.5 text-xs text-emerald-400 whitespace-nowrap">
              <span className="flex gap-0.5"><div className="w-1 h-1 bg-current rounded-full"/><div className="w-1 h-1 bg-current rounded-full"/></span> 
              Visual Builder <span className="text-[10px] bg-emerald-400/20 px-1 rounded text-emerald-300">✓</span>
            </div>
            
            {/* The Bar */}
            <div className="w-full h-full rounded border border-white/10 bg-gradient-to-r from-zinc-800 to-rose-900/40 relative">
              {/* Internal segments / milestones */}
              <div className="absolute left-[30%] top-1/2 -translate-y-1/2 w-1.5 h-1.5 border border-white/30 rotate-45" />
              <div className="absolute left-[60%] top-1/2 -translate-y-1/2 w-1.5 h-1.5 border border-rose-500/50 rotate-45 bg-rose-500/20" />
              
              <div className="absolute left-0 -bottom-5 text-[9px] text-zinc-600 text-center w-[60%]">Canvas UI</div>
              <div className="absolute left-[60%] -bottom-5 text-[9px] text-zinc-600 text-center w-[40%]">Beta Release</div>
            </div>
          </motion.div>

          {/* Curved path connecting UI Refresh to Split fares */}
          <svg className="absolute top-[4.5rem] left-[15%] w-[25%] h-32 pointer-events-none opacity-30 z-0 overflow-visible">
             <path d="M 0 50 C 50 50, 100 0, 250 0" fill="none" stroke="currentColor" strokeWidth="1" className="text-emerald-500" strokeDasharray="4 4" />
          </svg>

          {/* Project 2: EIP-1167 Proxies */}
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "45%", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute top-32 left-[12%] h-7 z-10"
          >
            <div className="absolute -top-6 left-0 flex items-center gap-1.5 text-xs text-emerald-500 whitespace-nowrap">
              <span className="flex border border-current rounded-sm px-0.5 text-[8px]">O</span>
              Factory Proxies <span className="text-[10px] bg-emerald-500/20 px-1 rounded text-emerald-400">~</span>
            </div>
            <div className="w-full h-full rounded border border-white/10 bg-gradient-to-r from-zinc-800 to-sky-900/30 relative">
              <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-1.5 h-1.5 border border-white/30 rotate-45" />
              <div className="absolute left-[70%] top-1/2 -translate-y-1/2 w-1.5 h-1.5 border border-white/30 rotate-45" />
              
              <div className="absolute left-[10%] -bottom-5 text-[9px] text-zinc-600 w-[20%] text-center">Devnet</div>
              <div className="absolute left-[60%] -bottom-5 text-[9px] text-zinc-600 w-[40%] text-center">Testnet (Amoy)</div>
            </div>
          </motion.div>

          {/* Curved path connecting Split Fares to Autonomy status */}
          <svg className="absolute top-[9.5rem] left-[35%] w-[35%] h-24 pointer-events-none opacity-20 z-0 overflow-visible">
             <path d="M 0 0 C 150 0, 150 70, 250 70" fill="none" stroke="white" strokeWidth="1" />
          </svg>

          {/* Project 3: Automated Deployment */}
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "25%", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute top-[14rem] left-[65%] h-7 z-10"
          >
            <div className="absolute -top-6 left-0 flex items-center gap-1.5 text-xs text-blue-400 whitespace-nowrap">
              <span className="flex"><div className="w-2 h-2 border-[1.5px] border-current rounded-full" /></span>
              1-Click Deployment <span className="text-[10px] bg-emerald-500/20 px-1 rounded text-emerald-400">~</span>
            </div>
            <div className="w-full h-full rounded border border-white/10 bg-zinc-900 relative">
              <div className="absolute left-[45%] top-1/2 -translate-y-1/2 w-1.5 h-1.5 border border-white/30 rotate-45" />
              <div className="absolute left-0 -bottom-5 text-[9px] text-zinc-600 w-full text-center">Mainnet V1</div>
            </div>
          </motion.div>

          {/* Generic placeholder background row */}
          <div className="absolute top-[19rem] left-[5%] w-[30%] h-7 rounded border border-white/5 bg-transparent">
             <div className="absolute left-[60%] top-1/2 -translate-y-1/2 w-1.5 h-1.5 border border-white/10 rotate-45" />
             <div className="absolute left-0 -bottom-5 text-[9px] text-zinc-700 w-full text-center">V2 Audit</div>
          </div>
        </div>

        {/* Bottom Footer Credits / Legend matching design.png */}
        <div className="absolute bottom-4 right-12 text-xs text-zinc-500 font-mono flex items-center gap-16">
          <div className="flex flex-col gap-1">
            <span>2.1 &nbsp; Projects</span>
            <span>2.3 &nbsp; Initiatives</span>
          </div>
          <div className="flex flex-col gap-1">
            <span>2.2 &nbsp; Documents</span>
            <span>2.4 &nbsp; Visual planning</span>
          </div>
        </div>

      </div>
    </section>
  );
}
