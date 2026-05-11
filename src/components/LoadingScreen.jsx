export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-5">

        {/* Spinning favicon.jpeg logo */}
        <div className="relative flex items-center justify-center">
          {/* Outer glow ring — pulses */}
          <div className="absolute w-36 h-36 rounded-full border-2 border-amber-200/50 animate-ping opacity-30" />
          <div className="absolute w-32 h-32 rounded-full border border-navy-200/40 animate-pulse" />

          {/* The spinning image */}
          <div
            className="w-28 h-28 rounded-full overflow-hidden border-2 border-amber-400/30 shadow-industry-lg"
            style={{ animation: 'spinFavicon 3s linear infinite' }}
          >
            <img
              src="/Images/favicon.jpeg"
              alt="PTCGRAM"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Inner glow overlay */}
          <div className="absolute w-28 h-28 rounded-full bg-gradient-to-t from-amber-400/10 to-transparent pointer-events-none" />
        </div>

        {/* Company name */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-serif text-3xl text-navy-900 tracking-widest">PTCGRAM</span>
          <span className="font-sans text-[0.6rem] font-bold tracking-[0.22em] uppercase text-navy-900/40">PVT LTD.</span>
        </div>
        <span className="font-sans text-[0.65rem] font-bold tracking-[0.22em] uppercase text-amber-500">
          IDEA · PROFIT · FUTURE
        </span>

        {/* Progress bar */}
        <div className="w-44 h-0.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-navy-700 to-amber-500 rounded-full animate-load-bar animation-fill-both" />
        </div>
      </div>

      <style>{`
        @keyframes spinFavicon {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
