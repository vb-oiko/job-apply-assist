import { GridRowIdGetter } from "@mui/x-data-grid";

export const getRowId: GridRowIdGetter = (row) => row._id;
