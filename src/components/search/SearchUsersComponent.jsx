import { getApi, getAuthHeaders } from "../../config";
import UserCardComponent from "../user/UserCardComponent";
import LoaderScreen from "../LoaderScreen";
import { useNavigate } from "react-router-dom";
import usePaginatedFetch from "../../hooks/usePaginatedFetch";

export default function SearchUsersComponent({ query }) {
  const navigate = useNavigate();

  const loader = async (cursor, signal) => {
    if (!query) return { items: [], next: null };
    const isUrl =
      typeof cursor === "string" &&
      (cursor.startsWith("http") || cursor.startsWith("/"));
    const url = isUrl
      ? cursor
      : `${getApi()}/users/search?text=${query}&page=${cursor}`;

    const response = await fetch(url, {
      headers: getAuthHeaders(),
      signal,
    });

    if (!response.ok) throw new Error("Search failed");
    const data = await response.json();

    return { items: data.data || [], next: data.links?.next || null };
  };

  const {
    items: users,
    loading,
    initialLoading,
    hasMore,
    sentinelRef,
  } = usePaginatedFetch({
    loader,
    deps: [query],
    initialParam: 1,
    rootMargin: "400px",
  });

  const handleUserClick = (user) => {
    navigate(`/${user.username}`);
  };

  if (initialLoading)
    return <LoaderScreen text="Buscando usuarios..." inline />;

  if (users.length === 0 && !loading) {
    return (
      <div className="feed-state">
        <span className="material-symbols-outlined wip-icon">person_off</span>
        <p className="wip-text">No se encontraron usuarios para "{query}"</p>
      </div>
    );
  }

  return (
    <div className="users-list-container">
      {users.map((user, idx) => (
        <UserCardComponent
          key={`${user.id}-${idx}`}
          user={user}
          onClick={() => handleUserClick(user)}
        />
      ))}

      {(hasMore || loading) && <div ref={sentinelRef} style={{ height: 40 }} />}

      {loading && !initialLoading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "40px",
            width: "100%",
          }}
        >
          <LoaderScreen inline small text="Buscando más usuarios..." />
        </div>
      )}

      {!hasMore && !loading && users.length > 0 && (
        <div className="feed-end" style={{ marginTop: "20px" }}>
          <span className="material-symbols-outlined">music_note</span>
          Has llegado al final de los resultados.
        </div>
      )}
    </div>
  );
}
