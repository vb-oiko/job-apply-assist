import { trpc } from "../utils/trpc";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowIdGetter,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
const getRowId: GridRowIdGetter = (row) => row._id;

export const PromptList = () => {
  const { data } = trpc.listPrompts.useQuery({});

  if (!data) {
    return null;
  }

  const { prompts } = data;

  const columns: GridColDef[] = [
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      renderCell: (value) => value.row.type.replaceAll("_", " "),
    },
    {
      field: "prompt",
      headerName: "Prompt",
      flex: 3,
    },
    {
      field: "actions",
      type: "actions",
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem icon={<EditIcon />} label="Toggle Admin" />,
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" />,
      ],
    },
  ];

  return (
    <>
      <DataGrid
        autoHeight
        rows={prompts}
        columns={columns}
        getRowId={getRowId}
        rowSelection={false}
        sx={{
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
        }}
      />
    </>
  );
};
