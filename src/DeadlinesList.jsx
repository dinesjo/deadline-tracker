import React from "react";
import {
  Alert,
  Box,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardOverflow,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  Tab,
  TabList,
  TabPanel,
  Tabs,
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

const StatusChip = ({ status, id, setDeadlines }) => {
  const nextStatus = {
    "Not Started": "In Progress",
    "In Progress": "Completed",
    Completed: "Not Started",
  }[status];

  const cycleStatus = () => {
    setDeadlines((current) => {
      return current.map((deadline) => {
        if (deadline.id === id) {
          return { ...deadline, status: nextStatus };
        }
        return deadline;
      });
    });
  };

  return (
    <Chip
      variant="solid"
      size="sm"
      color={statuses.color[status]}
      startDecorator={statuses.icon[status]}
      onClick={() => {
        cycleStatus();
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
      sx={{
        color: types.find((t) => t.name === type).color,
      }}
      startDecorator={types.find((t) => t.name === type).icon}
    >
      {type}
    </Chip>
  );
};

const DeadlineCard = ({
  deadline,
  index,
  setDeadlines,
  setArchived,
  course,
}) => {
  const deleteDeadline = () => {
    setDeadlines((current) => {
      return current.filter((_, i) => i !== index);
    });
  };

  const archiveDeadline = () => {
    setArchived((current) => {
      return [...current, deadline];
    });
    deleteDeadline();
  };

  const daysLeft = () => {
    if (!deadline.date) return null;
    const days = Math.ceil(
      (new Date(deadline.date).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return days;
  };

  return (
    <Card
      variant="soft"
      sx={{
        width: "70vw",
        opacity: deadline.status === "Completed" ? 0.35 : 1,
      }}
    >
      <CardOverflow sx={{ backgroundColor: course.color, py: 0.25 }}>
        <Typography level="title-md" fontWeight={700} sx={{ color: "black" }}>
          {course.name}
        </Typography>
        <Divider inset="context" />
      </CardOverflow>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Title */}
          <Typography level="title-lg">
            {deadline.title.toUpperCase()}
          </Typography>
          {/* Type */}
          {deadline.type && (
            <TypeChip type={deadline.type} sx={{ ml: "auto" }} />
          )}
        </Box>
        {/* Date */}
        {deadline.date && (
          <Typography level="body-sm" startDecorator={<FaCalendarDay />}>
            {deadline.date}
          </Typography>
        )}
        {/* Details */}
        <Typography level="body-md">{deadline.details}</Typography>
        <CardActions>
          {/* <Button variant="solid" color="primary">
            Docs
          </Button> */}
          <ButtonGroup
            sx={{
              ml: "auto",
              "--ButtonGroup-separatorColor": "none !important",
            }}
            variant="plain"
          >
            <IconButton
              color="warning"
              onClick={() => {
                archiveDeadline();
              }}
              title="Archive"
            >
              <FaArchive />
            </IconButton>
            <IconButton
              color="danger"
              onClick={() => {
                deleteDeadline();
              }}
              title="Delete"
            >
              <FaTrashAlt />
            </IconButton>
          </ButtonGroup>
        </CardActions>
      </CardContent>
      <CardOverflow>
        <Divider inset="context" />
        <CardContent
          orientation="horizontal"
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          {/* Status */}
          <StatusChip
            status={deadline.status}
            id={deadline.id}
            setDeadlines={setDeadlines}
          />
          {/* Days left */}
          {deadline.date && (
            <Typography
              startDecorator={<FaCalendarDay />}
              level={daysLeft() < 7 ? "body-md" : "body-sm"}
              color={
                daysLeft() < 3
                  ? "danger"
                  : daysLeft() < 7
                  ? "warning"
                  : "neutral"
              }
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
  courses,
}) {
  return (
    <Tabs defaultValue={0}>
      {/* Tab buttons and # indicator */}
      <TabList>
        <Tab value={0}>
          All{" "}
          <Chip variant="outlined" size="sm" color="neutral" sx={{ ml: 1 }}>
            {deadlines.length}
          </Chip>
        </Tab>
        {courses.map((course, index) => (
          <Tab
            value={index + 1}
            sx={{
              color: course.color,
            }}
            disabled={
              deadlines.filter((deadline) => deadline.course === course.name)
                .length === 0
            }
          >
            {course.name}
            <Chip variant="outlined" color="neutral" size="sm" sx={{ ml: 1 }}>
              {
                deadlines.filter((deadline) => deadline.course === course.name)
                  .length
              }
            </Chip>
          </Tab>
        ))}
      </TabList>
      {/* ALL-tab */}
      <TabPanel value={0}>
        <List>
          {deadlines.length === 0 && (
            <ListItem key={0}>
              <Alert variant="soft" color="neutral">
                <Box>
                  <Typography level="title-lg">No Deadlines</Typography>
                  <Typography level="body-sm">
                    You have no deadlines. Add one from above.
                  </Typography>
                </Box>
              </Alert>
            </ListItem>
          )}
          {deadlines
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((deadline, index) => (
              <ListItem key={deadline.id}>
                <DeadlineCard
                  deadline={deadline}
                  index={index}
                  setDeadlines={setDeadlines}
                  setArchived={setArchived}
                  course={courses.find(
                    (course) => course.name === deadline.course
                  )}
                />
              </ListItem>
            ))}
        </List>
      </TabPanel>
      {/* Course[i]-tabs */}
      {courses.map((course, index) => (
        <TabPanel value={index + 1}>
          <List>
            {deadlines.length === 0 && (
              <ListItem key={index}>
                <Alert variant="soft" color="neutral">
                  <Box>
                    <Typography level="title-lg">No Deadlines</Typography>
                    <Typography level="body-sm">
                      You have no deadlines. Add one from above.
                    </Typography>
                  </Box>
                </Alert>
              </ListItem>
            )}
            {deadlines
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((deadline, index) => (
                <>
                  {course.name === deadline.course && (
                    <ListItem key={deadline.id}>
                      <DeadlineCard
                        deadline={deadline}
                        index={index}
                        setDeadlines={setDeadlines}
                        setArchived={setArchived}
                        course={courses.find(
                          (course) => course.name === deadline.course
                        )}
                      />
                    </ListItem>
                  )}
                </>
              ))}
          </List>
        </TabPanel>
      ))}
    </Tabs>
  );
}
