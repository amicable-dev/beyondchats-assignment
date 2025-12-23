import ArticlesPage from "./components/ArticlesPage";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-950">
      {/* Minimal header */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-black/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-white via-neutral-200 to-neutral-400 shadow-[0_10px_26px_rgba(0,0,0,0.85)]">
              <div className="h-4 w-4 rounded-lg bg-neutral-950 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)]" />
            </div>

            {/* Title */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white">
                Article Studio
              </p>
              <p className="text-[11px] text-neutral-400">
                Laravel content · React viewer
              </p>
            </div>
          </div>

          {/* Right side kept ultra-minimal */}
          <span className="hidden text-[11px] text-neutral-500 sm:inline">
            BeyondChats assignment
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-4 py-5">
        <ArticlesPage />
      </main>
    </div>
  );
}

export default App;
