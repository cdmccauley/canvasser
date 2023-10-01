import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Loading() {
  return (
    <Grid container justifyContent="center">
      <Grid item>
        <Box sx={{ display: "flex", mt: 2 }}>
          <CircularProgress color="inherit" />
        </Box>
      </Grid>
    </Grid>
  );
}
