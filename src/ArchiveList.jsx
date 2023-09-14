import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardOverflow,
  Grid,
  IconButton,
  List,
  ListItem,
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

  return (
    <>
      <Grid container spacing={2}>
        {archived
          .sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          })
          .map((deadline, index) => (
            <Grid key={index}>
              <Card
                variant="soft"
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CardOverflow
                  sx={{
                    backgroundColor: courses.find(
                      (course) => course.name === deadline.course
                    ).color,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pr: 0,
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
                    <IconButton
                      title="Unarchive"
                      variant="plain"
                      color="primary"
                      onClick={() => {
                        unarchiveDeadline(index);
                      }}
                    >
                      <FaBoxOpen />
                    </IconButton>
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
            </Grid>
          ))}
      </Grid>
    </>
  );
}
