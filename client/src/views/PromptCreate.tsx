import { useNavigate } from "react-router-dom";
import {
  PromptInsertObject,
  PromptType,
} from "../../../server/constants/types";
import { PromptForm } from "../components/PromptForm";
import { trpc } from "../utils/trpc";

export const PromptCreate = () => {
  const utils = trpc.useContext();
  const createPrompt = trpc.createPrompt.useMutation({
    onSuccess: () => {
      utils.listPrompts.invalidate();
    },
  });
  const navigate = useNavigate();

  const handleSubmit = (prompt: PromptInsertObject) => {
    createPrompt.mutate(prompt);
    navigate("/prompts");
  };

  const { data: promptTypes } = trpc.getPromptTypes.useQuery<PromptType[]>();

  return (
    <>
      <PromptForm onSubmit={handleSubmit} promptTypes={promptTypes || []} />
    </>
  );
};
