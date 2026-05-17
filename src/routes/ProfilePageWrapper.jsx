// Wrapper necesario porque React Router reutiliza la misma instancia del componente
// cuando solo cambia el param :username (ej: de /alice a /bob).
// Al pasar key={username}, React destruye y recrea ProfilePage con cada cambio de usuario,
// garantizando que useEffect se ejecute de nuevo y se carguen los datos correctos.
import { useParams } from "react-router-dom";
import ProfilePage from "./ProfilePage";

export default function ProfilePageWrapper() {
  const { username } = useParams();
  return <ProfilePage key={username} />;
}
