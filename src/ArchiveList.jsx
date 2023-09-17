import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardOverflow,
  Grid,
  IconButton,
  Typography,
} from "@mui/joy";
import { FaBoxOpen, FaCalendarDay, FaTrashAlt } from "react-icons/fa";

export default function ArchiveList({
  archived,
  setArchived,
  setDeadlines,
  courses,
}) {
  // Delete archived deadline
  const deleteArchived = (index) => {
    setArchived((prev) => {
      const newArchived = [...prev];
      newArchived.splice(index, 1);
      return newArchived;
    });
  };

  // Unarchive deadline
  const unarchiveDeadline = (index) => {
    setArchived((prev) => {
      const newArchived = [...prev];
      newArchived.splice(index, 1);
      return newArchived;
    });
    setDeadlines((prev) => {
      const newDeadlines = [...prev];
      newDeadlines.push(archived[index]);
      return newDeadlines;
    });
  };

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
        sx={{ justifyContent: "center" }}
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
            <Grid xs={12} md={6} lg={4} key={index}>
              <ArchiveCard
                deadline={deadline}
                index={index}
                deleteArchived={deleteArchived}
                unarchiveDeadline={unarchiveDeadline}
                courses={courses}
              />
            </Grid>
          ))}
      </Grid>
    </>
  );
}

function ArchiveCard({
  deadline,
  index,
  deleteArchived,
  unarchiveDeadline,
  courses,
}) {
  return (
    <Card variant="soft">
      <CardOverflow
        sx={{
          backgroundColor: courses.find(
            (course) => course.name === deadline.course
          ).color,
        }}
      >
        <Typography
          level="title-md"
          fontWeight={700}
          sx={{
            color: "black",
          }}
        >
          {deadline.course}
        </Typography>
      </CardOverflow>
      <CardContent>
        <Typography variant="h4">{deadline.title}</Typography>
        <Typography variant="body-md">
          {deadline.date && (
            <>
              <Typography
                startDecorator={<FaCalendarDay />}
                level="body-sm"
                color="primary"
              >
                {deadline.date}
              </Typography>
            </>
          )}
        </Typography>
      </CardContent>
      <CardActions>
        <ButtonGroup
          sx={{
            ml: "auto",
            "--ButtonGroup-separatorColor": "none !important",
          }}
          variant="plain"
        >
          <Button
            variant="plain"
            color="primary"
            onClick={() => {
              unarchiveDeadline(index);
            }}
            startDecorator={<FaBoxOpen />}
          >
            Unarchive
          </Button>
          <IconButton
            title="Delete"
            variant="plain"
            color="danger"
            onClick={() => {
              // Bring up confirmation modal
              if (
                !window.confirm(
                  "Are you sure you want to delete this deadline?\nTHIS CANNOT BE UNDONE."
                )
              )
                return;
              deleteArchived(index);
            }}
          >
            <FaTrashAlt />
          </IconButton>
        </ButtonGroup>
      </CardActions>
    </Card>
  );
}
