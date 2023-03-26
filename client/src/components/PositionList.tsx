import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from "@mui/x-data-grid";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getRowId } from "../utils/getRowId";
import { trpc } from "../utils/trpc";

export const PositionList = () => {
  const { data: positions } = trpc.listPositions.useQuery({});

  const utils = trpc.useContext();
  const deletePositionMutation = trpc.deletePosition.useMutation({
    onSuccess: () => {
      utils.listPositions.invalidate();
    },
  });

  const handleDelete = React.useCallback(
    (id: GridRowId) => () => {
      deletePositionMutation.mutateAsync(String(id));
    },
    []
  );

  const navigate = useNavigate();

  const handleEdit = React.useCallback(
    (id: GridRowId) => () => {
      navigate(`/positions/${id}`);
    },
    []
  );

  if (!positions) {
    return null;
  }

  const columns: GridColDef[] = [
    { field: "url", headerName: "URL", flex: 1 },
    { field: "description", headerName: "Description", flex: 3 },
    {
      field: "actions",
      type: "actions",
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={handleEdit(params.id)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDelete(params.id)}
        />,
      ],
    },
  ];

  return (
    <DataGrid
      autoHeight
      rows={positions}
      columns={columns}
      getRowId={getRowId}
      sx={{
        "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
          outline: "none !important",
        },
      }}
    />
  );
};
