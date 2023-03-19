import { trpc } from "../utils/trpc";
import { DataGrid, GridColDef, GridRowIdGetter } from "@mui/x-data-grid";

const getRowId: GridRowIdGetter = (row) => row._id;

export const PositionList = () => {
  const { data } = trpc.listPositions.useQuery({});

  if (!data) {
    return null;
  }

  const { positions } = data;

  const columns: GridColDef[] = [
    { field: "url", headerName: "URL", flex: 1 },
    { field: "description", headerName: "Description", flex: 3 },
  ];

  return (
    <DataGrid
      autoHeight
      rows={positions}
      columns={columns}
      getRowId={getRowId}
    />
  );
};
