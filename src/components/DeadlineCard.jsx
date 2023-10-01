import { useState } from "react";
import {
  Badge,
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
  FaExclamationTriangle,
  FaGoogleDrive,
  FaRegCircle,
  FaSpinner,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
import types from "../types";
import SelectType from "./form-components/SelectType";
import SelectCourse from "./form-components/SelectCourse";
import RequiredDisclaimer from "./form-components/RequiredDisclaimer";
import { daysFromNow } from "../app";

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

// const isMobile = window.innerWidth < 600;

export default function DeadlineCard({
  deadline,
  deadlines,
  setDeadlines,
  archived,
  setArchived,
  courses,
  sx,
}) {
  const isArchived = archived.some((d) => d.id === deadline.id);
  const course = courses.find((course) => course.name === deadline.course);
  const [editing, setEditing] = useState(false);
  const [editedDeadline, setEditedDeadline] = useState(deadline);
  const daysLeft = daysFromNow(deadline.date);
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitEdit();
        setEditing(false);
      }}
    >
      <Badge
        badgeContent="Archived!"
        invisible={!isArchived}
        color="warning"
        sx={{
          display: "block",
          width: "100%",
        }}
      >
        <Card
          id={`deadline-${deadline.id}`}
          variant="soft"
          sx={{
            opacity: deadline.status === "Completed" && !editing ? 0.6 : 1,
            // Spring-like transition below
            transition: "0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
            transitionProperty: "opacity, transform, scale",
            filter: isArchived ? "grayscale(1)" : "",
            ...sx,
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
                deadline={editedDeadline}
                onChange={(e) => {
                  setEditedDeadline((current) => ({
                    ...current,
                    course: e.target.textContent,
                  }));
                }}
              />
            ) : (
              <Typography
                level="title-md"
                fontWeight="xl"
                sx={{
                  color: "black",
                }}
              >
                {course.name}
              </Typography>
            )}
            {/* Discard edits button */}
            {setDeadlines && (
              <ButtonGroup
                sx={{
                  "--ButtonGroup-separatorColor": "none !important",
                }}
              >
                {editing && (
                  <IconButton
                    onClick={() => {
                      setEditing(false);
                      setEditedDeadline(deadline);
                    }}
                    title="Discard changes"
                    color="danger"
                    variant="solid"
                    sx={{
                      color: "white",
                      borderRadius: 0,
                    }}
                  >
                    <FaTimes />
                  </IconButton>
                )}
                {/* Edit/Confirm button */}
                {!isArchived && (
                  <IconButton
                    type={editing ? "submit" : "button"}
                    onClick={() => {
                      if (!editing) {
                        setEditing(true);
                      }
                    }}
                    title={editing ? "Save" : "Edit"}
                    color={editing ? "primary" : "neutral"}
                    variant={editing ? "solid" : "plain"}
                    sx={{
                      color: editing ? "white" : "black",
                      borderRadius: 0,
                      ":hover": {
                        color: !editing ? course.color : "",
                      },
                    }}
                  >
                    {editing ? <FaCheck /> : <FaEdit />}
                  </IconButton>
                )}
              </ButtonGroup>
            )}
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
                <Badge
                  invisible={editedDeadline.title != ""}
                  sx={{ width: 1 / 2 }}
                >
                  <Input
                    required
                    type="text"
                    value={editedDeadline.title}
                    onChange={(e) => {
                      setEditedDeadline((current) => ({
                        ...current,
                        title: e.target.value,
                      }));
                    }}
                  />
                </Badge>
              ) : (
                <Typography
                  level="title-lg"
                  sx={{
                    textDecoration:
                      deadline.status === "Completed" ? "line-through" : "none",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {deadline.title}
                </Typography>
              )}
              {/* Type */}
              {editing ? (
                <SelectType
                  deadline={editedDeadline}
                  onChange={(e) => {
                    e &&
                      setEditedDeadline((current) => ({
                        ...current,
                        type: e.target.textContent,
                      }));
                  }}
                  clearValue={() => {
                    setEditedDeadline((current) => ({
                      ...current,
                      type: null,
                    }));
                  }}
                  width={1 / 2}
                />
              ) : (
                deadline.type && (
                  <TypeChip type={deadline.type} sx={{ ml: "auto" }} />
                )
              )}
            </Box>
            {/* Date */}
            {editing ? (
              <Input
                required
                type="date"
                slotProps={{
                  input: {
                    min: "2023-09-10T00:00",
                  },
                }}
                size="sm"
                value={editedDeadline.date}
                sx={{
                  width: "fit-content",
                }}
                onChange={(e) => {
                  if (e.target.value != "") {
                    setEditedDeadline((current) => ({
                      ...current,
                      date: e.target.value,
                    }));
                  }
                }}
              />
            ) : (
              deadline.date && (
                <Typography level="body-xs" startDecorator={<FaCalendarDay />}>
                  {new Date(deadline.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </Typography>
              )
            )}
            {/* Details */}
            {editing ? (
              <Textarea
                sx={{ height: "4em", overflow: "hidden", resize: "vertical" }}
                value={editedDeadline.details}
                type="textarea"
                placeholder="Details"
                onChange={(e) => {
                  setEditedDeadline((current) => ({
                    ...current,
                    details: e.target.value,
                  }));
                }}
              />
            ) : (
              <Typography level="body-sm">{deadline.details}</Typography>
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
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Drive
                </Link>
              )}
              <Box sx={{ display: "flex", gap: ".5em", ml: "auto" }}>
                {!editing && !isArchived && setDeadlines && (
                  <Button
                    size="sm"
                    variant="plain"
                    color="warning"
                    onClick={() => {
                      archiveDeadline();
                    }}
                    title="Archive"
                    startDecorator={<FaArchive />}
                  >
                    Archive
                  </Button>
                )}

                {!editing &&
                  setDeadlines && ( // Hide buttons while editing
                    <Button
                      size="sm"
                      variant="solid"
                      color="danger"
                      onClick={() => {
                        // Bring up confirmation modal
                        if (
                          !window.confirm(
                            "Are you sure you want to delete this deadline?\nTHIS CANNOT BE UNDONE."
                          )
                        )
                          return;
                        // Animate card deletion
                        const card = document.querySelector(
                          `#deadline-${deadline.id}`
                        );
                        card.style.opacity = 0;
                        card.style.transform = "scale(0)";
                        setTimeout(() => {
                          // Delete deadline
                          setDeadlines((current) => {
                            return current.filter((d) => d.id !== deadline.id);
                          });
                          // Also remove from archived if it's there
                          setArchived((current) => {
                            return current.filter((d) => d.id !== deadline.id);
                          });
                        }, 500);
                      }}
                      title="Delete"
                      startDecorator={<FaTrashAlt />}
                    >
                      Delete
                    </Button>
                  )}
              </Box>
            </CardActions>
            {/* Required-disclaimer */}
            {editing && <RequiredDisclaimer />}
          </CardContent>
          <CardOverflow>
            <Divider inset="context" />
            <CardContent
              orientation="horizontal"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1,
              }}
            >
              {/* Status */}
              {setDeadlines && (
                <>
                  <StatusChip
                    status={deadline.status}
                    id={deadline.id}
                    setDeadlines={setDeadlines}
                  />
                  <Divider orientation="vertical" />
                </>
              )}
              {/* Days left */}
              {deadline.date && (
                <Typography
                  level="body-sm"
                  startDecorator={daysLeft < 3 && <FaExclamationTriangle />}
                  color={daysLeftColor}
                  noWrap
                >
                  {daysLeftText}
                </Typography>
              )}
            </CardContent>
          </CardOverflow>
        </Card>
      </Badge>
    </form>
  );

  function archiveDeadline() {
    // Animate archive
    animateArchive();

    // If the only deadline during this date, delete date divider immediately
    deleteDateDividerIfOnlyOneDeadline();

    // Archive after animation
    setTimeout(() => {
      setArchived((current) => {
        return [...current, deadline];
      });
      setDeadlines((current) => {
        return current.filter((d) => d.id !== deadline.id);
      });
    }, 500);
  }

  function submitEdit() {
    setDeadlines((current) => {
      return current.map((d) => {
        if (d.id === deadline.id) {
          return editedDeadline;
        }
        return d;
      });
    });
  }

  function animateArchive() {
    // Get position of archived button
    const { archivedButtonCenterX, archivedButtonCenterY } =
      getArchivedBtnCenterCoords();
    // Get position of card
    const card = document.querySelector(`#deadline-${deadline.id}`);
    const cardBadge = card.parentElement.querySelector(".MuiBadge-badge");
    cardBadge.style.opacity = 0;
    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;
    // Calculate translation
    const translateX = archivedButtonCenterX - cardCenterX;
    const translateY = archivedButtonCenterY - cardCenterY;
    // Animate
    card.style.position = "absolute";
    card.style.opacity = 0;
    card.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.25)`;
  }

  function deleteDateDividerIfOnlyOneDeadline() {
    // Ensure there is only one deadline with this date
    if (deadlines.filter((d) => d.date === deadline.date).length !== 1) {
      return;
    }

    // Get date divider
    const dateDividers = document.querySelectorAll(".MuiDivider-root");
    const dateDivider = Array.from(dateDividers).find((d) => {
      return (
        d.nextElementSibling.querySelector(`#deadline-${deadline.id}`) != null
      ); // true if next elem contains this deadline
    });

    // Remove date divider
    if (dateDivider) {
      dateDivider.style.scale = 0;
    }
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
      variant="soft"
      size="sm"
      color={statuses.color[status]}
      startDecorator={statuses.icon[status]}
      onClick={() => {
        cycleStatus();
      }}
      sx={{
        py: 0.75,
        px: 1.5,
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

function getArchivedBtnCenterCoords() {
  const archivedButton = document.querySelector("#archived-button");
  const archivedButtonRect = archivedButton.getBoundingClientRect();
  const archivedButtonCenterX =
    archivedButtonRect.left + archivedButtonRect.width / 2;
  const archivedButtonCenterY =
    archivedButtonRect.top + archivedButtonRect.height / 2;
  return { archivedButtonCenterX, archivedButtonCenterY };
}
