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
  Divider,
  IconButton,
  Input,
  Link,
  Textarea,
  Typography,
} from "@mui/joy";
import {
  FaArchive,
  FaBoxOpen,
  FaCalendarDay,
  FaCheck,
  FaEdit,
  FaExclamationTriangle,
  FaGoogleDrive,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
import SelectType from "./form-components/SelectType";
import SelectCourse from "./form-components/SelectCourse";
import RequiredDisclaimer from "./form-components/RequiredDisclaimer";
import TypeChip from "./TypeChip";
import StatusChip from "./StatusChip";
import { daysFromNow } from "../app";
import ConfirmModal from "./ConfirmModal";

export default function DeadlineCard({
  deadline,
  deadlines,
  setDeadlines,
  archived,
  setArchived,
  courses,
  sx,
  settings,
}) {
  const [editing, setEditing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editedDeadline, setEditedDeadline] = useState(deadline);
  const isArchived = archived.some((d) => d.id === deadline.id);
  const course = courses.find((course) => course.name === deadline.course);
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
        e.preventDefault(); // Prevent page refresh
        setDeadlines((current) => {
          return current.map((d) => {
            if (d.id === deadline.id) {
              return editedDeadline;
            }
            return d;
          });
        });
        setEditing(false);
      }}
    >
      <Badge
        invisible={!isArchived}
        variant="plain"
        badgeContent="Archived!"
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
            // Spring-like transition
            transition: "0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
            transitionProperty: "opacity, transform, scale",
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
              filter: isArchived ? "grayscale(1)" : "",
            }}
          >
            {/* COURSE */}
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
            {/* EDIT/DISCARD BUTTONS */}
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
                {/* EDIT/CONFIRM BUTTON */}
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
              {/* TITLE */}
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
              {/* TYPE */}
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
            {/* DATE */}
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
                  {new Date(deadline.date).toLocaleDateString(settings.region, {
                    month: "short",
                    day: "numeric",
                  })}
                </Typography>
              )
            )}
            {/* DETAILS */}
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
              {/* DRIVE BUTTON */}
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
              {/* ARCHIVE/UNARCHIVE, DELETE */}
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
                {!editing && isArchived && setDeadlines && (
                  <Button
                    size="sm"
                    variant="plain"
                    color="primary"
                    onClick={() => {
                      setArchived((current) => {
                        return current.filter((d) => d.id !== deadline.id);
                      });
                      setDeadlines((current) => {
                        return [...current, deadline];
                      });
                    }}
                    title="Unarchive"
                    startDecorator={<FaBoxOpen />}
                  >
                    Unarchive
                  </Button>
                )}

                {/* DELETE */}
                {!editing &&
                  setDeadlines && ( // Hide buttons while editing
                    <>
                      <ConfirmModal
                        onConfirm={deleteDeadline}
                        modalOpen={deleteModalOpen}
                        setModalOpen={setDeleteModalOpen}
                        confirmColor="danger"
                      >
                        <strong>Permanently</strong> delete{" "}
                        <strong>{deadline.title}</strong>?
                      </ConfirmModal>
                      <Button
                        size="sm"
                        variant="solid"
                        color="danger"
                        onClick={() => {
                          setDeleteModalOpen(true);
                        }}
                        title="Delete"
                        startDecorator={<FaTrashAlt />}
                      >
                        Delete
                      </Button>
                    </>
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
              {/* STATUS */}
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
              {/* DAYS LEFT */}
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

  /**
   * Animates card to archive button, then archives it
   */
  function archiveDeadline() {
    // ANIMATION, only visually
    // Get archived button center
    const archivedButton = document.querySelector("#archived-button");
    const archivedButtonRect = archivedButton.getBoundingClientRect();
    const archivedButtonCenterX =
      archivedButtonRect.left + archivedButtonRect.width / 2;
    const archivedButtonCenterY =
      archivedButtonRect.top + archivedButtonRect.height / 2;
    // Get card center
    const card = document.querySelector(`#deadline-${deadline.id}`);
    card.parentElement.querySelector(".MuiBadge-badge").style.opacity = 0; // Prevents badge from showing up after animation
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

    // DELETE DATE DIVIDER
    if (deadlines.filter((d) => d.date === deadline.date).length === 1) {
      // Get date divider by finding the one that has deadline as next element
      const dateDividers = document.querySelectorAll(".MuiDivider-root");
      const dateDivider = Array.from(dateDividers).find((d) => {
        d.nextElementSibling.querySelector(`#deadline-${deadline.id}`) != null;
      });
      // Remove date divider if found
      if (dateDivider) {
        dateDivider.style.scale = 0; // "scale" animates nicely
      }
    }

    // LOGIC
    setTimeout(() => {
      setArchived((current) => {
        return [...current, deadline];
      });
      setDeadlines((current) => {
        return current.filter((d) => d.id !== deadline.id);
      });
    }, 400);
  }

  /**
   * Animates card deletion, then deletes it
   */
  function deleteDeadline() {
    // Animate card deletion
    const card = document.querySelector(`#deadline-${deadline.id}`);
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
    }, 400);
  }
}
