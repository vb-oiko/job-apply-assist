import { useNavigate } from "react-router-dom";
import { PositionForm, PositionFormData } from "../components/PositionForm";
import { trpc } from "../utils/trpc";

export const PositionCreate = () => {
  const utils = trpc.useContext();
  const createPosition = trpc.createPosition.useMutation({
    onSuccess: () => {
      utils.listPositions.invalidate();
      navigate("/positions");
    },
  });

  const navigate = useNavigate();

  const handleSubmit = (data: PositionFormData) => {
    if (!data.url || !data.description) {
      return;
    }

    createPosition.mutate({
      url: data.url,
      description: data.description,
      questions: data.questions,
      type: "raw",
    });
  };

  return <PositionForm onSubmit={handleSubmit} type="raw" />;
};
