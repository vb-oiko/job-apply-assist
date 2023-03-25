import { useNavigate } from "react-router-dom";
import { RawPositionInsertObject } from "../../../server/constants/types";
import { PositionForm } from "../components/PositionForm";
import { trpc } from "../utils/trpc";

export const PositionCreate = () => {
  const utils = trpc.useContext();
  const createReport = trpc.createPosition.useMutation({
    onSuccess: () => {
      utils.listPositions.invalidate();
    },
  });

  const navigate = useNavigate();

  const handleSubmit = (position: RawPositionInsertObject) => {
    createReport.mutate(position);
    navigate("/positions");
  };
  return (
    <>
      <PositionForm onSubmit={handleSubmit} />
    </>
  );
};
