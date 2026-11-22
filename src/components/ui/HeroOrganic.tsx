/**
 * Soft organic backdrop for the coat hero — large flowing tan shapes
 * matching the reference (not a starfield). Decorative only.
 */
export function HeroOrganic() {
  return (
    <div className="hero-organic pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
      <svg
        className="hero-organic__svg absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heroOrgGradA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbb392" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#b89a78" stopOpacity="0.28" />
          </linearGradient>
          <linearGradient id="heroOrgGradB" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d8c3a5" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#c4aa88" stopOpacity="0.22" />
          </linearGradient>
          <linearGradient id="heroOrgGradC" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#e9dcc6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c4aa88" stopOpacity="0.18" />
          </linearGradient>
        </defs>

        {/* Upper-left dune / ribbon */}
        <path
          className="hero-organic__shape hero-organic__shape--a"
          fill="url(#heroOrgGradA)"
          d="M-80 40
             C120 -40 280 120 420 90
             C580 55 640 200 820 170
             C980 140 1080 40 1220 80
             C1320 105 1400 160 1520 120
             L1520 -40 L-80 -40 Z"
        />

        {/* Mid soft wave behind portrait */}
        <path
          className="hero-organic__shape hero-organic__shape--b"
          fill="url(#heroOrgGradC)"
          d="M-60 520
             C180 420 340 580 520 500
             C720 410 860 560 1040 480
             C1180 420 1300 500 1500 460
             L1500 940 L-60 940 Z"
        />

        {/* Right organic lobe */}
        <path
          className="hero-organic__shape hero-organic__shape--c"
          fill="url(#heroOrgGradB)"
          d="M980 80
             C1120 -20 1280 40 1380 160
             C1480 290 1420 420 1360 560
             C1290 720 1180 820 1040 860
             C900 900 820 780 860 640
             C900 500 860 180 980 80 Z"
        />

        {/* Left soft petal */}
        <path
          className="hero-organic__shape hero-organic__shape--d"
          fill="url(#heroOrgGradA)"
          d="M-40 180
             C80 100 200 220 240 340
             C280 470 160 580 40 620
             C-40 650 -100 520 -80 400
             C-60 280 -100 230 -40 180 Z"
        />
      </svg>

      {/* Extra blurred orbs for depth (CSS-driven) */}
      <div className="hero-organic__orb hero-organic__orb--tl" />
      <div className="hero-organic__orb hero-organic__orb--br" />
      <div className="hero-organic__orb hero-organic__orb--mid" />
    </div>
  )
}
