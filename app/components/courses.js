import { useState, useEffect, useContext } from "react";

import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Checkbox from "@mui/material/Checkbox";

import InboxRoundedIcon from "@mui/icons-material/InboxRounded";

import { DataGrid } from "@mui/x-data-grid";

import { StateContext } from "../provider";

const CourseToggle = ({ params }) => {
  const [checked, setChecked] = useState(true);

  const state = useContext(StateContext);

  useEffect(() => {
    if (state?.disabled && Array.isArray(state?.disabled)) {
      const result = state.disabled.find((c) => c == params.row.id);
      if (result) setChecked(false);
    }
  }, [state.disabled]);

  const handleChange = () => {
    if (state?.set && checked) {
      state.set({
        ...state,
        disabled: state?.disabled
          ? [...state.disabled, params.row.id]
          : [params.row.id],
      });
    } else if (state?.set) {
      state.set({
        ...state,
        disabled: state.disabled.filter((c) => c != params.row.id),
      });
    }

    setChecked(!checked);
  };

  return <Checkbox checked={checked} onChange={() => handleChange()} />;
};

// column structure and options
const columns = [
  {
    field: "enabled",
    headerName: "Enabled?",
    flex: 0,
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) => <CourseToggle params={params} />,
  },
  { field: "course", headerName: "Course", flex: 1 },
  { field: "name", headerName: "Name", flex: 3 },
];

export default function Courses() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState();

  const state = useContext(StateContext);

  useEffect(() => {
    if (state?.courses) {
      if (Array.isArray(state.courses)) {
        setRows(
          state.courses.map((c, i) => {
            return { id: c?.id, course: c?.sisId ? c.sisId : "", name: c.name };
          })
        );
      }
    }
  }, [state.courses]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        color="inherit"
        variant="outlined"
        onClick={() => handleClickOpen()}
      >
        <InboxRoundedIcon />
      </IconButton>
      <Dialog fullWidth maxWidth="xl" open={open} onClose={handleClose}>
        <DialogTitle>Course Selection</DialogTitle>
        <DialogContent>
          <DataGrid
            sx={{ m: 2 }}
            disableRowSelectionOnClick
            rows={rows}
            columns={columns}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
