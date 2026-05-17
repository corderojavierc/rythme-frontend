import { useState, useEffect, useRef } from "react";

// Hook reutilizable para cargar listas paginadas con scroll infinito.
// Usa IntersectionObserver para detectar cuando el usuario llega al final y cargar más elementos.
// 'loader' es una función async que recibe (cursor, signal) y devuelve { items, next, meta }.
// 'deps' son dependencias extra que reinician la lista cuando cambian (ej: un filtro activo).
// 'initialParam' es el cursor inicial (normalmente 1 para páginas, o null/undefined para URLs).
// 'rootMargin' controla cuántos px antes del final del scroll se dispara la carga siguiente.
export default function usePaginatedFetch({
  loader,
  deps = [],
  initialParam = 1,
  rootMargin = "400px",
}) {
  const [items, setItems] = useState([]);
  const [next, setNext] = useState(null);       // cursor de la siguiente página (null = no hay más)
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // true solo hasta que carga la primera página
  const [meta, setMeta] = useState(null);       // metadatos opcionales de la respuesta (total, etc.)

  // abortRef: guarda el AbortController activo para cancelar fetch si llega una petición nueva
  const abortRef = useRef(null);
  // mountedRef: evita actualizar el estado si el componente ya fue desmontado (memory leak)
  const mountedRef = useRef(true);
  // loadRef: guardamos la función de carga en una ref para poder llamarla desde el IntersectionObserver
  // sin que el observer tenga que recrearse cada vez que cambia la función
  const loadRef = useRef(null);

  // sentinelEl es el elemento DOM vacío que ponemos al final de la lista.
  // Cuando el observer detecta que es visible, cargamos la siguiente página.
  const [sentinelEl, setSentinelEl] = useState(null);
  const sentinelRef = setSentinelEl;

  // Limpia al desmontar el componente: cancela cualquier fetch en curso
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  // La función principal de carga. Se guarda en loadRef.current para que el observer
  // siempre acceda a la versión más reciente sin crear dependencias de efecto.
  loadRef.current = async (cursor = initialParam, append = true) => {
    if (!loader) return { items: [], next: null };
    if (loading) return;   // evita peticiones simultáneas
    setLoading(true);

    // Cancela la petición anterior si todavía está en curso (ej: búsqueda mientras escribes)
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    try {
      const result = await loader(cursor, abortRef.current.signal);
      if (!mountedRef.current) return;  // componente desmontado → no actualizamos estado

      const newItems = result?.items || [];
      const nextCursor = result?.next ?? null;
      const m = result?.meta ?? null;

      setNext(nextCursor);
      setMeta(m);

      setItems((prev) => {
        if (!append) return newItems;                   // reemplazo total (reset)
        if (cursor === initialParam) return newItems;   // primera página: reemplazamos
        return [...prev, ...newItems];                  // páginas siguientes: añadimos al final
      });

      return result;
    } catch (err) {
      // AbortError es esperado cuando cancelamos la petición; no lo logueamos como error
      if (!(err && err.name === "AbortError")) console.error(err);
      throw err;
    } finally {
      if (!mountedRef.current) return;
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // Reinicia la lista cuando cambian el loader o las deps (ej: cambio de filtro o página)
  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();
    setItems([]);
    setNext(initialParam);
    setInitialLoading(true);
    setMeta(null);
    if (loadRef.current) loadRef.current(initialParam, false);
  }, [loader, initialParam, ...deps]);

  // IntersectionObserver: vigila el elemento sentinel (div vacío al final de la lista).
  // Cuando entra en el viewport (con el margen configurado), carga la siguiente página.
  useEffect(() => {
    if (!sentinelEl) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && next) {
          if (loadRef.current) loadRef.current(next, true);
        }
      },
      { rootMargin }, // el scroll infinito se dispara 400px antes de llegar al final
    );

    observer.observe(sentinelEl);
    return () => observer.disconnect(); // limpieza al desmontar o cuando cambia el sentinel
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
    sentinelRef,  // ref para asignar al div sentinel: <div ref={sentinelRef} />
    setItems,
    next,
    meta,
  };
}
