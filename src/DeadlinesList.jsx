import React from "react";
import { useState } from "react";
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
  Grid,
  IconButton,
  Input,
  ListItemDecorator,
  Option,
  Select,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Textarea,
  Typography,
} from "@mui/joy";
import {
  FaArchive,
  FaCalendarDay,
  FaCheck,
  FaCheckCircle,
  FaEdit,
  FaRegCircle,
  FaSpinner,
  FaTrashAlt,
} from "react-icons/fa";
import types from "./types";
import { SelectCourse, SelectType } from "./NewDeadlineForm";

const statuses = {
  color: {
    "Not Started": "neutral",
    "In Progress": "primary",
    Completed: "success",
  },
  icon: {
    "Not Started": <FaRegCircle />,
    "In Progress": <FaSpinner />,
    Completed: <FaCheckCircle />,
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
      variant="soft"
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
      variant="soft"
      sx={{
        color: types.find((t) => t.name === type).color,
      }}
      startDecorator={types.find((t) => t.name === type).icon}
    >
      {type}
    </Chip>
  );
};

const NoDeadlinesAlert = () => {
  return (
    <Alert
      variant="soft"
      color="neutral"
      sx={{ display: "flex", justifyContent: "center" }}
    >
      <Typography level="body-md">
        You have no deadlines. Add one from above.
      </Typography>
    </Alert>
  );
};

const DeadlineCard = ({ deadline, setDeadlines, setArchived, courses }) => {
  const course = courses.find((course) => course.name === deadline.course);

  const deleteDeadline = () => {
    setDeadlines((current) => {
      return current.filter((d) => d.id !== deadline.id);
    });
  };

  const archiveDeadline = () => {
    setArchived((current) => {
      return [...current, deadline];
    });
    deleteDeadline();
  };

  const editDeadline = (property, newValue) => {
    setDeadlines((current) => {
      return current.map((d) => {
        if (d.id === deadline.id) {
          return { ...d, [property]: newValue };
        }
        return d;
      });
    });
  };

  const daysLeft = () => {
    if (!deadline.date) return null;
    const days = Math.ceil(
      (new Date(deadline.date).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return days;
  };

  const [editing, setEditing] = useState(false);

  return (
    <Card
      variant="soft"
      sx={{
        opacity: deadline.status === "Completed" && !editing ? 0.6 : 1,
      }}
    >
      <CardOverflow
        sx={{
          backgroundColor: course.color,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 0,
        }}
      >
        {/* Course */}
        {editing ? (
          <SelectCourse
            courses={courses}
            deadline={deadline}
            onChange={(e) => {
              editDeadline("course", e.target.textContent);
            }}
          />
        ) : (
          <Typography
            level="title-md"
            fontWeight={700}
            sx={{
              color: "black",
            }}
          >
            {course.name}
          </Typography>
        )}
        {/* Edit button */}
        <IconButton
          onClick={() => {
            setEditing(!editing);
          }}
          title={editing ? "Save" : "Edit"}
          color={editing ? "primary" : "neutral"}
          variant={editing ? "solid" : "plain"}
          sx={{
            color: editing ? "white" : "black",
            borderRadius: 0,
            ":hover": {
              color: course.color,
            },
          }}
        >
          {editing ? <FaCheck /> : <FaEdit />}
        </IconButton>
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
          {editing ? (
            <Input
              type="text"
              value={deadline.title}
              onChange={(e) => {
                editDeadline("title", e.target.value);
              }}
            />
          ) : (
            <Typography
              level="title-lg"
              sx={{
                textDecoration:
                  deadline.status === "Completed" ? "line-through" : "none",
              }}
            >
              {deadline.title}
            </Typography>
          )}
          {/* Type */}
          {deadline.type &&
            (editing ? (
              <SelectType
                deadline={deadline}
                onChange={(e) => {
                  editDeadline("type", e.target.textContent);
                }}
              />
            ) : (
              deadline.type && (
                <TypeChip type={deadline.type} sx={{ ml: "auto" }} />
              )
            ))}
        </Box>
        {/* Date */}
        {editing ? (
          <Input
            type="date"
            slotProps={{
              input: {
                min: "2023-09-10T00:00",
              },
            }}
            size="sm"
            value={deadline.date}
            sx={{
              width: "fit-content",
            }}
            onChange={(e) => editDeadline("date", e.target.value)}
          />
        ) : (
          deadline.date && (
            <Typography level="body-sm" startDecorator={<FaCalendarDay />}>
              {deadline.date}
            </Typography>
          )
        )}
        {/* Details */}
        {editing ? (
          <Textarea
            sx={{ height: "4em", overflow: "hidden", resize: "vertical" }}
            value={deadline.details}
            type="textarea"
            placeholder="Details"
            onChange={(e) => editDeadline("details", e.target.value)}
          />
        ) : (
          <Typography level="body-md">{deadline.details}</Typography>
        )}
        <CardActions>
          {/* <Button variant="solid" color="primary">
            Docs
          </Button> */}
          {!editing && ( // Hide buttons while editing
            <ButtonGroup
              sx={{
                ml: "auto",
                "--ButtonGroup-separatorColor": "none !important",
              }}
              variant="plain"
            >
              <IconButton
                color="neutral"
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
                  // Bring up confirmation modal
                  if (
                    !window.confirm(
                      "Are you sure you want to delete this deadline?\nTHIS CANNOT BE UNDONE."
                    )
                  )
                    return;
                  deleteDeadline();
                }}
                title="Delete"
              >
                <FaTrashAlt />
              </IconButton>
            </ButtonGroup>
          )}
        </CardActions>
      </CardContent>
      <CardOverflow>
        <Divider inset="context" />
        <CardContent
          orientation="horizontal"
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
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
              level={
                daysLeft() < 3 && deadline.status != "Completed"
                  ? "body-md"
                  : "body-sm"
              }
              color={
                daysLeft() < 3 && deadline.status != "Completed"
                  ? "danger"
                  : daysLeft() < 7 && deadline.status != "Completed"
                  ? "warning"
                  : "neutral"
              }
              noWrap
            >
              {daysLeft()} day(s) left
            </Typography>
          )}
        </CardContent>
      </CardOverflow>
    </Card>
  );
};

const TabPanelForCourse = ({ index, columns, deadlines, ...props }) => {
  return (
    <TabPanel value={index}>
      <Grid
        container
        spacing={4}
        columns={columns}
        sx={{ justifyContent: "center" }}
      >
        {deadlines.length === 0 && (
          <Grid key={index} xs={12}>
            <NoDeadlinesAlert />
          </Grid>
        )}
        {deadlines
          .sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
          })
          .map((deadline) => (
            <Grid xs={12} sm={6} lg={4} key={deadline.id}>
              <DeadlineCard {...props} deadline={deadline} />
            </Grid>
          ))}
      </Grid>
    </TabPanel>
  );
};

export default function DeadlinesList({
  deadlines,
  setDeadlines,
  setArchived,
  courses,
}) {
  // Number of columns in grid
  let columns = 12;
  if (deadlines.length === 1) {
    columns = 4;
  } else if (deadlines.length === 2) {
    columns = 8; // Share between two
  }

  return (
    <Tabs defaultValue={-1}>
      {/* Tab buttons and number indicator */}
      <TabList sx={{ overflowX: "auto" }}>
        <Tab
          value={-1}
          sx={{
            minWidth: "fit-content",
          }}
        >
          All{" "}
          <Chip variant="outlined" size="sm" color="neutral" sx={{ ml: 1 }}>
            {deadlines.length}
          </Chip>
        </Tab>
        {courses.map((course, index) => (
          <Tab
            value={index}
            sx={{
              color: course.color,
              minWidth: "fit-content",
            }}
            disabled={
              deadlines.filter((deadline) => deadline.course === course.name)
                .length === 0
            }
            key={index}
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
      <TabPanelForCourse
        index={-1}
        columns={columns}
        deadlines={deadlines}
        setDeadlines={setDeadlines}
        setArchived={setArchived}
        courses={courses}
      />
      {/* Course[i]-tabs */}
      {courses
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((course, index) => (
          <TabPanelForCourse
            index={index}
            columns={columns}
            deadlines={deadlines.filter(
              (deadline) => deadline.course === course.name
            )}
            setDeadlines={setDeadlines}
            setArchived={setArchived}
            courses={courses}
            key={index}
          />
        ))}
    </Tabs>
  );
}
