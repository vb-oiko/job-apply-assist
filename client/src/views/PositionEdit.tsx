import { useNavigate, useParams } from "react-router-dom";
import { PositionUpdateObject } from "../../../server/constants/types";
import { NoMatch } from "../components/NoMatch";
import { PositionForm, PositionFormData } from "../components/PositionForm";
import { trpc } from "../utils/trpc";

export const PositionEdit = () => {
  const { id } = useParams();
  const utils = trpc.useContext();
  const navigate = useNavigate();
  const updatePosition = trpc.updatePosition.useMutation({
    onSuccess: () => {
      utils.listPositions.invalidate();
      navigate("/positions");
    },
  });

  if (!id) {
    return <NoMatch />;
  }

  const handleSubmit = (data: PositionUpdateObject) => {
    updatePosition.mutate({
      id,
      position: data,
    });
  };

  const { data: position } = trpc.getPosition.useQuery(id);

  if (!position) {
    return null;
  }

  const { _id, type, created, ...rest } = position;

  return (
    <PositionForm onSubmit={handleSubmit} type={type} initialValues={rest} />
  );
};
