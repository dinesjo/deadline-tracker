import { useState } from "react";
import {
  Box,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardOverflow,
  Chip,
  Divider,
  IconButton,
  Input,
  Link,
  Textarea,
  Typography,
} from "@mui/joy";
import {
  FaArchive,
  FaCalendarDay,
  FaCheck,
  FaCheckCircle,
  FaEdit,
  FaGoogleDrive,
  FaRegCircle,
  FaSpinner,
  FaTrashAlt,
} from "react-icons/fa";
import types from "../types";
import SelectType from "./form-components/SelectType";
import SelectCourse from "./form-components/SelectCourse";

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

const isMobile = window.innerWidth < 600;

export default function DeadlineCard({
  deadline,
  setDeadlines,
  setArchived,
  courses,
}) {
  const course = courses.find((course) => course.name === deadline.course);
  const [editing, setEditing] = useState(false);
  const daysLeft = getDaysLeft();
  let daysLeftText;
  let daysLeftColor = daysLeft < 3 ? "danger" : daysLeft < 7 ? "warning" : null;
  switch (daysLeft) {
    case 0:
      daysLeftText = "Due today";
      break;
    case 1:
      daysLeftText = "Due tomorrow";
      break;
    case -1:
      daysLeftText = "Due yesterday";
      break;
    default:
      daysLeftText = `${daysLeft} days left`;
      break;
  }

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
          {!editing && course.googleDriveURL && (
            <Link
              variant="solid"
              color="primary"
              startDecorator={<FaGoogleDrive />}
              href={course.googleDriveURL}
              target="_blank"
              rel="noreferrer"
            >
              Open {course.name}
            </Link>
          )}
          {!editing && ( // Hide buttons while editing
            <ButtonGroup
              sx={{
                ml: "auto",
                "--ButtonGroup-separatorColor": "none !important",
              }}
              variant={isMobile ? "solid" : "plain"} // Solid btns on mobile
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
              level={
                daysLeft < 3 && deadline.status != "Completed"
                  ? "body-md"
                  : "body-sm"
              }
              color={daysLeftColor}
              noWrap
            >
              {daysLeftText}
              {/* {daysLeft} day{Math.abs(daysLeft) != 1 ? "s" : ""} left */}
              {/* {daysLeft}{daysLeft < 0 ? " overdue" : `day${daysLeft != 1 ? "s" : ""} left`} */}
              {/* {`${daysLeft} day${daysLeft != 1 ? "s" : ""} ${daysLeft < 0 ? "overdue" : "left"}`} */}
            </Typography>
          )}
        </CardContent>
      </CardOverflow>
    </Card>
  );

  function deleteDeadline() {
    setDeadlines((current) => {
      return current.filter((d) => d.id !== deadline.id);
    });
  }

  function archiveDeadline() {
    setArchived((current) => {
      return [...current, deadline];
    });
    deleteDeadline();
  }

  function editDeadline(property, newValue) {
    setDeadlines((current) => {
      return current.map((d) => {
        if (d.id === deadline.id) {
          return { ...d, [property]: newValue };
        }
        return d;
      });
    });
  }

  function getDaysLeft() {
    if (!deadline.date) return null;
    const days = Math.ceil(
      (new Date(deadline.date).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return days;
  }
}

function StatusChip({ status, id, setDeadlines }) {
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
      variant={status == "Not Started" ? "soft" : "solid"}
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
}

function TypeChip({ type }) {
  return (
    <Chip
      variant="outlined"
      sx={{
        color: types.find((t) => t.name === type).color,
      }}
      startDecorator={types.find((t) => t.name === type).icon}
    >
      {type}
    </Chip>
  );
}
