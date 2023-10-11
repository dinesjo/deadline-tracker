import { Alert, Grid, Typography } from "@mui/joy";
import DeadlineCard from "./components/deadline-card/DeadlineCard";

export default function ArchiveList({ archived, ...props }) {
  // Number of columns in grid
  let columns = 12;
  if (archived.length === 1) {
    columns = 4;
  } else if (archived.length === 2) {
    columns = 8; // Share between two
  }

  return (
    <>
      <Grid
        container
        spacing={2}
        columns={columns}
        sx={{
          justifyContent: "center",
          overflowY: "auto",
          overflowX: "hidden", // hide part of "Archive" badge
        }}
      >
        {archived.length === 0 && (
          <Grid xs={12}>
            <Alert
              variant="soft"
              color="neutral"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Typography level="body-md">
                You have no archived deadlines.
              </Typography>
            </Alert>
          </Grid>
        )}
        {archived
          .sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          })
          .map((deadline, index) => (
            <Grid xs={12} md={6} xl={4} key={index}>
              <DeadlineCard
                deadline={deadline}
                archived={archived}
                {...props}
              />
            </Grid>
          ))}
      </Grid>
    </>
  );
}
