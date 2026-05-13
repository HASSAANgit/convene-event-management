/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary gold palette
        primary: {
          50:  '#fbf9f4',
          100: '#f5efe4',
          200: '#ebdbbf',
          300: '#dfc292',
          400: '#D4AF37', // Main Gold
          500: '#c59d2a',
          600: '#a8801d',
          700: '#86601a',
          800: '#6f501b',
          900: '#5c431b',
          950: '#34230b',
        },
        // Accent hover gold palette
        accent: {
          300: '#fcd34d',
          400: '#FBBF24', // Hover Gold
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        // VIP Dark base palette
        base: {
          950: '#080808',
          900: '#0F0F0F', // Base Background
          800: '#1C1C1C', // Card Background
          700: '#262626',
          600: '#404040',
          500: '#525252',
          400: '#A1A1AA', // Text Muted
          100: '#F5F5F5', // Text White
        },
        // Danger/Red palette
        danger: {
          400: '#f87171',
          500: '#EF4444', // Red Accent
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'glass':         'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(28,28,28,0.5) 100%)',
        'hero-gradient': 'radial-gradient(ellipse at 30% 40%, rgba(212,175,55,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(239,68,68,0.1) 0%, transparent 50%)',
        'glow-primary':  'radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)',
        'glow-accent':   'radial-gradient(circle, rgba(251,191,36,0.35) 0%, transparent 70%)',
        'card-shine':    'linear-gradient(135deg, rgba(245,245,245,0.06) 0%, transparent 60%)',
        'mesh-gradient': `
          radial-gradient(at 27% 37%, hsla(45,67%,53%,0.15) 0px, transparent 50%),
          radial-gradient(at 97% 21%, hsla(0,84%,60%,0.1) 0px, transparent 50%),
          radial-gradient(at 52% 99%, hsla(45,67%,30%,0.20) 0px, transparent 50%),
          radial-gradient(at 10% 29%, hsla(45,90%,25%,0.1) 0px, transparent 50%),
          radial-gradient(at 97% 96%, hsla(0,70%,40%,0.05) 0px, transparent 50%)
        `,
      },
      boxShadow: {
        'glass':          '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(245,245,245,0.06)',
        'primary-glow':   '0 0 30px rgba(212,175,55,0.4), 0 0 60px rgba(212,175,55,0.15)',
        'accent-glow':    '0 0 25px rgba(251,191,36,0.4), 0 0 50px rgba(251,191,36,0.15)',
        'card-3d':        '0 20px 60px rgba(0,0,0,0.8), 0 8px 20px rgba(212,175,55,0.1)',
        'card-hover':     '0 30px 80px rgba(0,0,0,0.9), 0 0 40px rgba(212,175,55,0.25)',
        'inset-top':      'inset 0 1px 0 rgba(245,245,245,0.08)',
        'btn-primary':    '0 4px 24px rgba(212,175,55,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
        'btn-accent':     '0 4px 24px rgba(251,191,36,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
      },
      animation: {
        'float-slow':   'floatSlow 8s ease-in-out infinite',
        'float-fast':   'floatFast 5s ease-in-out infinite',
        'orbit':        'orbit 12s linear infinite',
        'orbit-rev':    'orbitRev 18s linear infinite',
        'spin-slow':    'spin 20s linear infinite',
        'pulse-primary':'pulsePrimary 3s ease-in-out infinite',
        'shimmer':      'shimmer 2.5s linear infinite',
        'slide-up':     'slideUp 0.6s cubic-bezier(0.16,1,0.3,1)',
        'fade-in':      'fadeIn 0.4s ease-out',
        'scale-in':     'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1)',
        'glow-pulse':   'glowPulse 4s ease-in-out infinite',
        'tilt':         'tilt 10s ease-in-out infinite',
        'bounce-subtle':'bounceSubtle 3s ease-in-out infinite',
        'text-shimmer': 'textShimmer 3s ease-in-out infinite',
        'particle':     'particle 6s ease-in-out infinite',
      },
      keyframes: {
        floatSlow: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':     { transform: 'translateY(-24px) rotate(1deg)' },
          '66%':     { transform: 'translateY(-12px) rotate(-1deg)' },
        },
        floatFast: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-16px)' },
        },
        orbit: {
          from: { transform: 'rotate(0deg) translateX(180px) rotate(0deg)' },
          to:   { transform: 'rotate(360deg) translateX(180px) rotate(-360deg)' },
        },
        orbitRev: {
          from: { transform: 'rotate(0deg) translateX(240px) rotate(0deg)' },
          to:   { transform: 'rotate(-360deg) translateX(240px) rotate(360deg)' },
        },
        pulsePrimary: {
          '0%,100%': { boxShadow: '0 0 20px rgba(212,175,55,0.3)' },
          '50%':     { boxShadow: '0 0 50px rgba(212,175,55,0.7), 0 0 100px rgba(212,175,55,0.25)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition:  '1000px 0' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%,100%': { opacity: '0.5' },
          '50%':     { opacity: '1' },
        },
        tilt: {
          '0%,100%': { transform: 'rotate3d(0,1,0,0deg)' },
          '25%':     { transform: 'rotate3d(0,1,0,2deg)' },
          '75%':     { transform: 'rotate3d(0,1,0,-2deg)' },
        },
        bounceSubtle: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        textShimmer: {
          '0%,100%': { backgroundPosition: '0% center' },
          '50%':     { backgroundPosition: '100% center' },
        },
        particle: {
          '0%,100%': { transform: 'translate(0,0) scale(1)', opacity: '0.6' },
          '33%':     { transform: 'translate(20px,-30px) scale(1.2)', opacity: '1' },
          '66%':     { transform: 'translate(-20px,-15px) scale(0.8)', opacity: '0.4' },
        },
      },
      perspective: {
        '500':  '500px',
        '1000': '1000px',
        '2000': '2000px',
      },
    },
  },
  plugins: [],
};
