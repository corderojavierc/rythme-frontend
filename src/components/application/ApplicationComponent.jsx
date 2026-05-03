import { useState, useEffect } from "react";
import { getApi } from "../../config";
import LoaderScreen from "../LoaderScreen";
import ApplicationPending from "./ApplicationPending";
import ApplicationStart from "./ApplicationStart";
import ApplicationAccepted from "./ApplicationAccepted";

export default function ApplicationComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasApplication, setHasApplication] = useState(false);
  const [user, setUser] = useState(() => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  });

  useEffect(() => {
    const checkApplication = async () => {
      try {
        const token = localStorage.getItem("token");

        const userStr = localStorage.getItem("user");
        const currentUser = userStr ? JSON.parse(userStr) : null;

        if (currentUser && currentUser.username) {
          const userRes = await fetch(`${getApi()}/users`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (userRes.ok) {
            const allUsers = await userRes.json();
            const usersList = allUsers.data || allUsers;
            const userData = usersList.find(
              (u) => u.username === currentUser.username,
            );
            if (userData) {
              setUser(userData);
              localStorage.setItem("user", JSON.stringify(userData));
              window.dispatchEvent(new Event("userUpdated"));
            }
          }
        }

        const response = await fetch(`${getApi()}/artist-applications/has`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (
          data.has_application ||
          data.error === "Ya tienes una aplicación pendiente."
        ) {
          setHasApplication(true);
        } else {
          setHasApplication(false);
        }
      } catch {
        setHasApplication(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkApplication();
  }, []);

  if (!user || user.type !== "user") return <ApplicationAccepted />;

  if (isLoading) {
    return <LoaderScreen text="Comprobando solicitudes... " inline={true} />;
  }

  return hasApplication ? <ApplicationPending /> : <ApplicationStart />;
}
