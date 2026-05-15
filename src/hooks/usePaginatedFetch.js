import { useState, useEffect, useRef } from "react";

export default function usePaginatedFetch({
  loader,
  deps = [],
  initialParam = 1,
  rootMargin = "400px",
}) {
  const [items, setItems] = useState([]);
  const [next, setNext] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [meta, setMeta] = useState(null);

  const abortRef = useRef(null);
  const mountedRef = useRef(true);
  const loadRef = useRef(null);

  const [sentinelEl, setSentinelEl] = useState(null);
  const sentinelRef = setSentinelEl;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  loadRef.current = async (cursor = initialParam, append = true) => {
    if (!loader) return { items: [], next: null };
    if (loading) return;
    setLoading(true);
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    try {
      const result = await loader(cursor, abortRef.current.signal);
      if (!mountedRef.current) return;

      const newItems = result?.items || [];
      const nextCursor = result?.next ?? null;
      const m = result?.meta ?? null;

      setNext(nextCursor);
      setMeta(m);

      setItems((prev) => {
        if (!append) return newItems;
        if (cursor === initialParam) return newItems;
        return [...prev, ...newItems];
      });

      return result;
    } catch (err) {
      if (!(err && err.name === "AbortError")) console.error(err);
      throw err;
    } finally {
      if (!mountedRef.current) return;
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();
    setItems([]);
    setNext(initialParam);
    setInitialLoading(true);
    setMeta(null);
    if (loadRef.current) loadRef.current(initialParam, false);
  }, [loader, initialParam, ...deps]);

  useEffect(() => {
    if (!sentinelEl) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && next) {
          if (loadRef.current) loadRef.current(next, true);
        }
      },
      { rootMargin },
    );

    observer.observe(sentinelEl);
    return () => observer.disconnect();
  }, [sentinelEl, loading, next, rootMargin]);

  return {
    items,
    loading,
    initialLoading,
    hasMore: !!next,
    loadMore: () => loadRef.current && loadRef.current(next, true),
    reset: () => {
      if (abortRef.current) abortRef.current.abort();
      setItems([]);
      setNext(initialParam);
      setInitialLoading(true);
      setMeta(null);
      if (loadRef.current) loadRef.current(initialParam, false);
    },
    sentinelRef,
    setItems,
    next,
    meta,
  };
}
