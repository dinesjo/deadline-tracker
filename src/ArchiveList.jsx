import {
  Button,
  Card,
  CardActions,
  CardContent,
  List,
  ListItem,
  Typography,
} from "@mui/joy";
import { FaBoxOpen, FaCalendarDay, FaTrashAlt } from "react-icons/fa";

export default function ArchiveList({ archived, setArchived, setDeadlines }) {
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
      <List
        sx={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {archived.map((deadline, index) => (
          <ListItem key={index}>
            <Card
              variant="soft"
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
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
                <Button
                  startDecorator={<FaBoxOpen />}
                  variant="plain"
                  color="primary"
                  onClick={() => {
                    unarchiveDeadline(index);
                  }}
                >
                  Unarchive
                </Button>
                <Button
                  startDecorator={<FaTrashAlt />}
                  variant="plain"
                  color="danger"
                  onClick={() => {
                    deleteArchived(index);
                  }}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </ListItem>
        ))}
      </List>
    </>
  );
}
