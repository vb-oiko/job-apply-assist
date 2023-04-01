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
    {
      field: "created",
      headerName: "Created",
      flex: 1.5,
      renderCell: (params) =>
        new Intl.DateTimeFormat("default", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: false,
        }).format(new Date(params.value)),
    },
    {
      field: "url",
      headerName: "URL",
      flex: 1,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          position page
        </a>
      ),
    },
    { field: "company", headerName: "Company", flex: 2 },
    { field: "title", headerName: "Position", flex: 3 },
    {
      field: "resumeUrl",
      headerName: "Resume",
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <a href={params.value} target="_blank" rel="noopener noreferrer">
            resume
          </a>
        ) : null,
    },
    {
      field: "coverLetterUrl",
      headerName: "Cover letter",
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <a href={params.value} target="_blank" rel="noopener noreferrer">
            cover letter
          </a>
        ) : null,
    },
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
