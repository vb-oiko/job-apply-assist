import { trpc } from "../utils/trpc";
import { DataGrid, GridColDef, GridRowIdGetter } from "@mui/x-data-grid";

const getRowId: GridRowIdGetter = (row) => row._id;

export const PromptList = () => {
  const { data } = trpc.listPrompts.useQuery({});

  if (!data) {
    return null;
  }

  const { prompts } = data;

  const columns: GridColDef[] = [
    { field: "type", headerName: "Type", flex: 1 },
    { field: "prompt", headerName: "Prompt", flex: 3 },
  ];

  return (
    <DataGrid autoHeight rows={prompts} columns={columns} getRowId={getRowId} />
  );
};
