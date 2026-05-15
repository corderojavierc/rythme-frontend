import { useParams } from "react-router-dom";
import ProfilePage from "./ProfilePage";

export default function ProfilePageWrapper() {
  const { username } = useParams();
  return <ProfilePage key={username} />;
}
