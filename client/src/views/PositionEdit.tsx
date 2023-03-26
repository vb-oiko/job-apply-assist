import { useParams } from "react-router-dom";
import { NoMatch } from "../components/NoMatch";

export const PositionEdit = () => {
  const { id } = useParams();

  if (!id) {
    return <NoMatch />;
  }

  return <div>{id}</div>;
};
