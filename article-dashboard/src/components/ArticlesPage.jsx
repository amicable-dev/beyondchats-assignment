import { useEffect, useState } from "react";
import ArticlesList from "./ArticlesList";
import ArticleDetail from "./ArticleDetail";

const API_BASE = "http://127.0.0.1:8000/api";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/articles`);
        const data = await res.json();
        setArticles(data);
        const initial =
          data.find((a) => a.is_updated) ?? data[0] ?? null;
        setSelected(initial);
      } catch (e) {
        console.error("Failed to load articles:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[68vh] flex-col items-center justify-center gap-4">
        <div className="h-9 w-9 animate-spin rounded-full border-[1.5px] border-white/10 border-t-white" />
        <p className="text-xs tracking-wide text-neutral-400">
          Fetching articles from Laravel API…
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
      <ArticlesList
        articles={articles}
        selected={selected}
        onSelect={setSelected}
      />
      <ArticleDetail article={selected} allArticles={articles} />
    </div>
  );
}
