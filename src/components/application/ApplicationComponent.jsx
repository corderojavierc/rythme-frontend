import { useState, useEffect } from "react";
import { getApi, getAuthHeaders, getUser } from "../../config";
import LoaderScreen from "../LoaderScreen";
import ApplicationPending from "./ApplicationPending";
import ApplicationStart from "./ApplicationStart";
import ApplicationAccepted from "./ApplicationAccepted";

export default function ApplicationComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasApplication, setHasApplication] = useState(false);
  const [user, setUser] = useState(() => getUser() || null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const userRes = await fetch(`${getApi()}/users/me`, {
          headers: getAuthHeaders(),
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          const actualUser = userData.data || userData;
          if (actualUser) {
            setUser(actualUser);
            localStorage.setItem("user", JSON.stringify(actualUser));
            window.dispatchEvent(new Event("userUpdated"));

            if (actualUser.type !== "user") {
              setIsLoading(false);
              return;
            }
          }
        }

        const res = await fetch(`${getApi()}/artist-applications/has`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        setHasApplication(data.has_application || data.is_accepted);
      } catch {
        setHasApplication(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  if (user && user.type !== "user") return <ApplicationAccepted user={user} />;
  if (isLoading) {
    return <LoaderScreen text="Comprobando solicitudes... " inline={true} />;
  }

  return hasApplication ? <ApplicationPending /> : <ApplicationStart />;
}
