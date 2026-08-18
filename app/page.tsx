import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
      <div className="min-h-screen relative flex flex-col justify-between bg-[#050a14] text-white overflow-hidden">

        {/* Background Pixel Art Atmosphere & Overlay */}
        <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0 opacity-40 pointer-events-none"
            style={{ backgroundImage: "url('/dashboard-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050a14]/60 via-[#050a14]/80 to-[#050a14] z-0 pointer-events-none" />

        {/* Navigation Header */}
        <header className="relative z-10 max-w-7xl w-full mx-auto p-6 md:px-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-indigo-500/30 bg-gray-950 shadow-lg shadow-indigo-950/50">
              <Image
                  src="/logo.png"
                  alt="Scriptwave Logo"
                  fill
                  className="object-contain p-1"
              />
            </div>
            <span className="text-xl font-black tracking-wider bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            SCRIPTWAVE
          </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-300 hover:text-white transition px-4 py-2 rounded-lg hover:bg-gray-900/60"
            >
              Dashboard
            </Link>
            <Link
                href="/devices"
                className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/30"
            >
              Explore Store
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <main className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center flex flex-col items-center my-auto">

          {/* Logo Centerpiece */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 mb-8 rounded-3xl p-3 bg-gradient-to-b from-indigo-950/80 to-gray-950/90 border border-indigo-500/30 shadow-2xl shadow-indigo-900/40 backdrop-blur-xl group transition transform hover:scale-105 duration-300">
            <Image
                src="/logo.png"
                alt="Scriptwave Logo"
                fill
                className="object-contain p-4 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                priority
            />
          </div>

          {/* Brand Title */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 bg-gradient-to-r from-white via-indigo-100 to-indigo-400 bg-clip-text text-transparent">
            Scriptwave
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-2xl font-medium text-indigo-200/90 max-w-2xl mb-10 tracking-wide">
            Premium used, new and refurbished devices
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <Link
                href="/devices"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-2xl transition shadow-xl shadow-indigo-600/30 border border-indigo-400/30 text-center"
            >
              Browse Inventory
            </Link>
            <Link
                href="/dashboard"
                className="w-full sm:w-auto bg-gray-900/80 hover:bg-gray-800 text-gray-200 font-semibold px-8 py-3.5 rounded-2xl transition border border-gray-800 backdrop-blur text-center"
            >
              Open Dashboard
            </Link>
          </div>

          {/* Value Props / Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 w-full text-left">
            <div className="bg-gray-950/50 backdrop-blur-md p-5 rounded-2xl border border-gray-800/80 shadow-lg">
              <div className="text-indigo-400 font-bold text-lg mb-1">⚡ Certified New</div>
              <p className="text-gray-400 text-sm">Top-tier cutting-edge hardware straight from manufacturers.</p>
            </div>
            <div className="bg-gray-950/50 backdrop-blur-md p-5 rounded-2xl border border-gray-800/80 shadow-lg">
              <div className="text-indigo-400 font-bold text-lg mb-1">🛠️ Expert Refurbished</div>
              <p className="text-gray-400 text-sm">Rigidly inspected and restored to peak operational performance.</p>
            </div>
            <div className="bg-gray-950/50 backdrop-blur-md p-5 rounded-2xl border border-gray-800/80 shadow-lg">
              <div className="text-indigo-400 font-bold text-lg mb-1">💎 Premium Used</div>
              <p className="text-gray-400 text-sm">Reliable, high-grade technology at exceptional value.</p>
            </div>
          </div>

        </main>

        {/* Footer */}
        <footer className="relative z-10 max-w-7xl w-full mx-auto p-6 text-center text-xs text-gray-500 border-t border-gray-900">
          © {new Date().getFullYear()} Scriptwave.tech. All rights reserved.
        </footer>

      </div>
  );
}