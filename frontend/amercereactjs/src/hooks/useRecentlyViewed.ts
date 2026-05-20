import { useEffect, useState } from "react";
import { productsAPI } from "@/services/api";
import { toProductCard } from "@/hooks/useApi";

const KEY     = "sk_recently_viewed";
const MAX     = 10;

function getSlugs(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}

export function trackView(slug: string) {
  if (!slug) return;
  const current = getSlugs().filter((s) => s !== slug);
  localStorage.setItem(KEY, JSON.stringify([slug, ...current].slice(0, MAX)));
}

export function useRecentlyViewed(excludeSlug?: string) {
  const [products, setProducts] = useState<ReturnType<typeof toProductCard>[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const slugs = getSlugs().filter((s) => s !== excludeSlug).slice(0, 8);
    if (slugs.length === 0) { setLoading(false); return; }

    Promise.all(slugs.map((s) => productsAPI.getOne(s).catch(() => null)))
      .then((results) => {
        const cards = results
          .filter((r) => !!r?.data?.data)
          .map((r) => toProductCard(r!.data.data));
        setProducts(cards);
      })
      .finally(() => setLoading(false));
  }, [excludeSlug]);

  return { products, loading };
}
