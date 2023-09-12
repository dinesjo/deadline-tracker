import React from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardOverflow,
  Chip,
  Divider,
  List,
  ListItem,
  Typography,
} from "@mui/joy";
import {
  FaArchive,
  FaBatteryEmpty,
  FaBatteryFull,
  FaBatteryHalf,
  FaCalendarDay,
  FaTrashAlt,
} from "react-icons/fa";
import types from "./types";

const statuses = {
  color: {
    "Not Started": "neutral",
    "In Progress": "warning",
    Completed: "success",
  },
  icon: {
    "Not Started": <FaBatteryEmpty />,
    "In Progress": <FaBatteryHalf />,
    Completed: <FaBatteryFull />,
  },
};

const StatusChip = ({ status, setDeadlines }) => {
  return (
    <Chip
      variant="solid"
      size="sm"
      color={statuses.color[status]}
      startDecorator={statuses.icon[status]}
      onClick={() => {
        setDeadlines((current) => {
          return current.map((deadline) => {
            if (deadline.status === status) {
              if (status === "Not Started") {
                return { ...deadline, status: "In Progress" };
              } else if (status === "In Progress") {
                return { ...deadline, status: "Completed" };
              } else {
                return { ...deadline, status: "Not Started" };
              }
            } else {
              return deadline;
            }
          });
        });
      }}
    >
      {status}
    </Chip>
  );
};

const TypeChip = ({ type }) => {
  return (
    <Chip
      variant="plain"
      color={types.color[type]}
      startDecorator={types.icon[type]}
      onClick={() => {}}
    >
      {type}
    </Chip>
  );
};

const DeadlineCard = ({ deadline, index, setDeadlines, setArchived }) => {
  return (
    <Card
      variant="soft"
      sx={{
        width: "100%",
        borderWidth: 3,
      }}
      color={statuses.color[deadline.status]}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography level="title-lg">
            {deadline.title.toUpperCase()}
          </Typography>
          {deadline.type && (
            <TypeChip type={deadline.type} sx={{ ml: "auto" }} />
          )}
        </Box>
        {deadline.date && (
          <Typography level="body-sm" startDecorator={<FaCalendarDay />}>
            {deadline.date}
          </Typography>
        )}
        <Typography level="body-md">{deadline.details}</Typography>
        <CardActions buttonFlex="0 1 120px">
          <Button variant="solid" color="primary">
            Docs
          </Button>
          <Button
            startDecorator={<FaArchive />}
            variant="plain"
            color="warning"
            sx={{ ml: "auto" }}
            onClick={() => {
              setArchived((current) => {
                return [...current, deadline];
              });
              setDeadlines((current) => {
                return current.filter((_, i) => i !== index);
              });
            }}
          >
            Arhive
          </Button>
          <Button
            startDecorator={<FaTrashAlt />}
            variant="plain"
            color="danger"
            onClick={() => {
              setDeadlines((current) => {
                return current.filter((_, i) => i !== index);
              });
            }}
          >
            Delete
          </Button>
        </CardActions>
      </CardContent>
      <CardOverflow>
        <Divider inset="context" />
        <CardContent
          orientation="horizontal"
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <StatusChip status={deadline.status} setDeadlines={setDeadlines} />
          {deadline.date && (
            <Typography
              startDecorator={<FaCalendarDay />}
              level="body-sm"
              color="primary"
            >
              {Math.ceil(
                (new Date(deadline.date).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              day(s) left
            </Typography>
          )}
        </CardContent>
      </CardOverflow>
    </Card>
  );
};

export default function DeadlinesList({
  deadlines,
  setDeadlines,
  setArchived,
}) {
  return (
    <List sx={{ width: 500 }}>
      {deadlines.length === 0 && (
        <ListItem>
          <Card
            variant="plain"
            sx={{
              width: "100%",
            }}
          >
            <CardContent>
              <Typography level="title-lg">No Deadlines</Typography>
              <Typography level="body-md">
                You have no deadlines. Add one from above.
              </Typography>
            </CardContent>
          </Card>
        </ListItem>
      )}
      {deadlines.map((deadline, index) => (
        <ListItem key={index}>
          <DeadlineCard
            deadline={deadline}
            index={index}
            setDeadlines={setDeadlines}
            setArchived={setArchived}
          />
        </ListItem>
      ))}
    </List>
  );
}
