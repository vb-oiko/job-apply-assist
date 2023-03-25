import { useNavigate, useParams } from "react-router-dom";
import { NoMatch } from "../components/NoMatch";

export const PositionEdit = () => {
  const { id: idParam } = useParams();
  const id = idParam ? parseInt(idParam) : null;

  if (!id || Number.isNaN(id)) {
    return <NoMatch />;
  }

  return <div>{id}</div>;
};
