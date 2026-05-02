import { useState, useEffect } from "react";
import { getApi } from "../../config";
import LoaderScreen from "../LoaderScreen";
import ApplicationPending from "./ApplicationPending";
import ApplicationStart from "./ApplicationStart";
import ApplicationError from "./ApplicationError";

export default function ApplicationComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasApplication, setHasApplication] = useState(false);
  const user = localStorage.getItem("user");

  useEffect(() => {
    const checkApplication = async () => {
      try {
        const token = localStorage.getItem("token");
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

  if (user.type !== "user") return <ApplicationError />;

  if (isLoading) {
    return <LoaderScreen text="Comprobando solicitudes... " inline={true} />;
  }

  return hasApplication ? <ApplicationPending /> : <ApplicationStart />;
}
