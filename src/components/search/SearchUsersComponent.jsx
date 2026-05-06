import { useState, useEffect, useRef } from "react";
import { getApi } from "../../config";
import UserCardComponent from "../user/UserCardComponent";
import LoaderScreen from "../LoaderScreen";
import { useNavigate } from "react-router-dom";

export default function SearchUsersComponent({ query }) {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async (pageNum = 1) => {
      if (!query) return;
      if (pageNum === 1) setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${getApi()}/users/search?text=${query}&page=${pageNum}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        const results = data.data || [];
        setUsers((prev) => (pageNum === 1 ? results : [...prev, ...results]));
        setHasMore(!!data.links?.next);
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setPage(1);
    fetchUsers(1);
  }, [query]);

  useEffect(() => {
    if (page > 1) {
      const fetchNextPage = async () => {
        setIsLoading(true);
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${getApi()}/users/search?text=${query}&page=${page}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          const data = await response.json();
          const results = data.data || [];
          setUsers((prev) => [...prev, ...results]);
          setHasMore(!!data.links?.next);
        } catch (error) {
          console.error("Error fetching next page:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchNextPage();
    }
  }, [page, query]);

  useEffect(() => {
    if (isLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "400px" },
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isLoading, hasMore]);

  const handleUserClick = (user) => {
    navigate(`/user/${user.id}`);
  };

  if (isLoading && page === 1)
    return <LoaderScreen text="Buscando usuarios..." inline />;

  if (users.length === 0 && !isLoading) {
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
      {(hasMore || isLoading) && (
        <div ref={sentinelRef} style={{ height: 40 }} />
      )}
      {isLoading && page > 1 && (
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
      {!hasMore && !isLoading && users.length > 0 && (
        <div className="feed-end" style={{ marginTop: "20px" }}>
          <span className="material-symbols-outlined">music_note</span>
          Has llegado al final de los resultados.
        </div>
      )}
    </div>
  );
}
