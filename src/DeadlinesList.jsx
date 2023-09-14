import React from "react";
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardOverflow,
  Chip,
  Divider,
  IconButton,
  Input,
  List,
  ListItem,
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

const statuses = {
  color: {
    "Not Started": "neutral",
    "In Progress": "warning",
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
      variant={status === "Completed" ? "outlined" : "solid"}
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

const DeadlineCard = ({
  index,
  deadline,
  setDeadlines,
  setArchived,
  course,
  courses,
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
        width: "70vw",
        opacity: deadline.status === "Completed" ? 0.6 : 1,
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
          <Select
            required
            onChange={(e) => {
              editDeadline("course", e.target.textContent);
            }}
            value={deadline.course}
            sx={{
              color: courses.find((course) => course.name === deadline.course)
                ?.color,
            }}
          >
            {courses.map((course, index) => (
              <Option
                key={index}
                value={course.name}
                sx={{
                  color: course.color,
                }}
              >
                {course.name}
              </Option>
            ))}
          </Select>
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
              <Select
                sx={{
                  width: "fit-content",
                  color: types.find((type) => type.name === deadline.type)
                    ?.color,
                }}
                size="sm"
                value={deadline.type}
                onChange={(e) => {
                  editDeadline("type", e.target.textContent);
                }}
                startDecorator={
                  deadline.type && (
                    // Icon for selected item
                    <ListItemDecorator
                      sx={{
                        color: types.find((type) => type.name === deadline.type)
                          ?.color,
                      }}
                    >
                      {types.find((type) => type.name === deadline.type)?.icon}
                    </ListItemDecorator>
                  )
                }
              >
                {types.map((type, index) => (
                  <Option
                    key={index}
                    value={type.name}
                    sx={{ color: type.color }}
                  >
                    <ListItemDecorator>{type.icon}</ListItemDecorator>
                    {type.name}
                  </Option>
                ))}
              </Select>
            ) : (
              <TypeChip type={deadline.type} sx={{ ml: "auto" }} />
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
            .sort((a, b) => {
              if (a.status === b.status) {
                return new Date(a.date) - new Date(b.date);
              } else if (a.status === "Completed") {
                return 1;
              } else if (b.status === "Completed") {
                return -1;
              }
            })
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
                  courses={courses}
                />
              </ListItem>
            ))}
        </List>
      </TabPanel>
      {/* Course[i]-tabs */}
      {courses
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((course, index) => (
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
                .sort((a, b) => {
                  if (a.status === b.status) {
                    return new Date(a.date) - new Date(b.date);
                  } else if (a.status === "Completed") {
                    return 1;
                  } else if (b.status === "Completed") {
                    return -1;
                  }
                })
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
                          courses={courses}
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
