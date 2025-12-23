export default function ArticlesList({ articles, selected, onSelect }) {
  return (
    <section className="flex max-h-[78vh] flex-col overflow-hidden rounded-[22px] border border-white/[0.06] bg-gradient-to-br from-neutral-900/70 via-neutral-950/85 to-black/90 p-4 shadow-[0_22px_55px_rgba(0,0,0,0.95)] backdrop-blur-2xl">
      {/* Header */}
      <header className="mb-3.5 flex items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.26em] text-neutral-100">
            Library
          </h2>
          <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-400">
            Originals on the left, AI‑updated entries highlighted.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[11px] tabular-nums tracking-wide text-neutral-200">
            {articles.length.toString().padStart(2, "0")} articles
          </span>
          <span className="text-[10px] text-neutral-500">
            {articles.filter((a) => a.is_updated).length} updated
          </span>
        </div>
      </header>

      {/* List */}
      <div className="space-y-1.5 overflow-y-auto pr-1.5">
        {articles.map((article) => {
          const isActive = selected && selected.id === article.id;
          const isUpdated = article.is_updated;
          return (
            <button
              key={article.id}
              type="button"
              onClick={() => onSelect(article)}
              className={[
                "group w-full rounded-[16px] border px-3.5 py-2.5 text-left transition-all duration-150",
                "bg-neutral-950/60 hover:bg-neutral-900/85",
                "border-white/[0.05] hover:border-white/25",
                isActive &&
                  "border-white bg-neutral-900 shadow-[0_18px_40px_rgba(0,0,0,0.95)] ring-1 ring-white/40",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-neutral-500">
                    #{article.id}
                  </span>
                  <h3 className="line-clamp-1 text-sm font-medium text-white">
                    {article.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  {isUpdated && article.original_article_id && (
                    <span className="rounded-full border border-emerald-400/50 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-200">
                      Based on #{article.original_article_id}
                    </span>
                  )}
                  <span
                    className={[
                      "whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                      isUpdated
                        ? "border-white bg-white text-black"
                        : "border-white/20 bg-white/[0.02] text-neutral-300",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {isUpdated ? "Updated" : "Original"}
                  </span>
                </div>
              </div>

              <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-neutral-400">
                {article.content}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
