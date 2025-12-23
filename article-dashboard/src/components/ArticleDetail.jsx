export default function ArticleDetail({ article, allArticles }) {
  if (!article) {
    return (
      <section className="flex max-h-[78vh] items-center justify-center rounded-[22px] border border-white/[0.06] bg-gradient-to-br from-neutral-900/70 via-neutral-950/85 to-black/90 p-6 text-sm text-neutral-400 shadow-[0_22px_55px_rgba(0,0,0,0.95)] backdrop-blur-2xl">
        Select an article from the left to preview its content.
      </section>
    );
  }

  const created = new Date(article.created_at);
  const isUpdated = article.is_updated;
  const origin =
    isUpdated && article.original_article_id
      ? allArticles.find((a) => a.id === article.original_article_id)
      : null;

  return (
    <section className="flex max-h-[78vh] flex-col overflow-hidden rounded-[22px] border border-white/[0.06] bg-gradient-to-br from-neutral-900/80 via-neutral-950/95 to-black p-4 shadow-[0_22px_55px_rgba(0,0,0,0.98)] backdrop-blur-2xl">
      {/* Header */}
      <header className="flex items-start justify-between gap-6 border-b border-white/[0.06] pb-3.5">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-neutral-300">
            {isUpdated ? "AI Updated Article" : "Original Article"}
          </p>
          <h1 className="text-[22px] font-medium leading-snug text-white">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-400">
            <span className="font-mono">#{article.id}</span>
            {isUpdated && origin && (
              <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-200">
                Based on #{origin.id}: {origin.title}
              </span>
            )}
          </div>
        </div>

        <div className="rounded-[16px] border border-white/15 bg-black/80 px-4 py-2.5 text-right shadow-inner">
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
            Created
          </p>
          <p className="mt-1 text-xs font-medium tracking-wide text-white">
            {created.toLocaleDateString()}
          </p>
        </div>
      </header>

      {/* Body */}
      <div className="mt-3.5 flex-1 overflow-y-auto rounded-[18px] bg-black/65 p-5 shadow-inner">
        {isUpdated && origin && (
          <div className="mb-4 rounded-[14px] border border-white/10 bg-neutral-900/70 p-3.5 text-[11px] text-neutral-300">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Source summary
            </p>
            <p className="line-clamp-2 text-[11px] text-neutral-300">
              Updated from original article{" "}
              <span className="font-mono text-neutral-100">
                #{origin.id}
              </span>{" "}
              titled <span className="text-neutral-50">“{origin.title}”</span>.
            </p>
          </div>
        )}

        <article className="prose prose-invert prose-sm max-w-none prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-white prose-p:leading-relaxed prose-p:text-neutral-200 prose-strong:text-white prose-a:text-neutral-100 prose-a:underline-offset-2">
          {article.content
            .split("\n")
            .filter((p) => p.trim().length)
            .map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
        </article>
      </div>
    </section>
  );
}
