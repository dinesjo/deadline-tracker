import {
  Alert,
  Chip,
  ChipDelete,
  Grid,
  IconButton,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { FaGoogleDrive, FaPalette, FaPlus } from "react-icons/fa";

const courseColors = [
  "#FF3333",
  "#FF5733",
  "#FF9900",
  "#FFCC00",
  "#66CC33",
  "#008800",
  "#3399FF",
  "#3366FF",
  "#9933CC",
  "#FF5577",
];

class Course {
  constructor(name, color, googleDriveURL) {
    this.name = name || "";
    this.color = color || "";
    this.googleDriveURL = googleDriveURL || "";
  }
}

export default function Courses({
  courses,
  setCourses,
  deadlines,
  setDeadlines,
  archived,
  setArchived,
}) {
  const [newCourse, setNewCourse] = useState(new Course());

  return (
    <>
      <Input
        placeholder="Course Name"
        endDecorator={
          <IconButton
            onClick={() => {
              addCourse(newCourse);
            }}
          >
            <FaPlus />
          </IconButton>
        }
        onChange={(e) => {
          setNewCourse({ ...newCourse, name: e.target.value });
        }}
        value={newCourse.name}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addCourse(newCourse);
          }
        }}
      />
      <Stack
        direction={"row"}
        sx={{
          maxHeight: "12.5em",
          display: "flex",
          flexWrap: "wrap",
          p: 1,
          gap: 1,
        }}
      >
        {courses.length === 0 && (
          <Alert
            variant="soft"
            color="neutral"
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <Typography level="body-md">You have no courses.</Typography>
          </Alert>
        )}
        {courses
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((course, index) => (
            <CourseChip
              key={index}
              course={course}
              index={index}
              renameCourse={renameCourse}
              changeColor={changeColor}
              removeCourse={removeCourse}
              deadlines={deadlines}
              archived={archived}
              changeGoogleDriveURL={changeGoogleDriveURL}
            />
          ))}
      </Stack>
    </>
  );
  function addCourse(course) {
    // Require unique name
    if (course.name === "" || courses.some((c) => c.name === course.name))
      return; // TODO: Show error message

    // Add new course
    course.color = getRandomColorCode();
    setCourses((current) => [...current, course]);

    // Reset user input state
    setNewCourse(new Course());
  }
  function renameCourse(course, newName) {
    // Require unique name
    if (newName === "" || courses.some((course) => course.name === newName))
      return; // TODO: Show error message

    // Rename course
    setCourses((current) => {
      return current.map((c) => {
        if (c === course) {
          return { ...c, name: newName };
        }
        return c;
      });
    });

    // Update deadlines with this course
    setDeadlines((current) => {
      return current.map((deadline) => {
        if (deadline.course === course.name) {
          return { ...deadline, course: newName };
        }
        return deadline;
      });
    });
  }
  function changeColor(course, color) {
    setCourses((current) => {
      return current.map((c) => {
        if (c === course) {
          return { ...c, color: color };
        }
        return c;
      });
    });
  }
  function changeGoogleDriveURL(course, googleDriveURL) {
    setCourses((current) => {
      return current.map((c) => {
        if (c === course) {
          return { ...c, googleDriveURL: googleDriveURL };
        }
        return c;
      });
    });
  }
  function removeCourse(course) {
    setCourses((current) => {
      return current.filter((c) => c !== course);
    });
    // Remove deadlines with this course
    setDeadlines((current) => {
      return current.filter((deadline) => deadline.course !== courses.name);
    });
    // Remove archived with this course
    setArchived((current) => {
      return current.filter((deadline) => deadline.course !== courses.name);
    });
  }
  function getRandomColorCode() {
    // Get random color code
    const color = courseColors[Math.floor(Math.random() * courseColors.length)];

    // Try again if color is already used and there are more colors available
    if (
      courseColors.length > courses.length &&
      courses.some((course) => course.color === color)
    )
      return getRandomColorCode();

    return color;
  }
}

function CourseChip({
  course,
  index,
  renameCourse,
  removeCourse,
  deadlines,
  archived,
  changeColor,
  changeGoogleDriveURL,
}) {
  const [open, setOpen] = useState(false); // edit course popup

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <ModalDialog
          sx={{
            width: "100%",
            maxWidth: "20em",
            p: 3,
          }}
        >
          <ModalClose />
          <Typography level="title-lg">Edit Course</Typography>
          <Typography level="title-md">Name</Typography>
          {/* Name */}
          <Input
            placeholder="Course Name"
            value={course.name}
            onChange={(e) => {
              renameCourse(course, e.target.value);
            }}
          />
          {/* Color */}
          <Typography
            level="title-md"
            startDecorator={<FaPalette />}
            sx={{ mt: 1 }}
          >
            Color
          </Typography>
          <Grid
            container
            spacing={1}
            sx={{ my: 1, display: "flex", justifyContent: "center" }}
          >
            {courseColors.map((color, i) => (
              <Grid
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconButton
                  sx={{
                    backgroundColor: color,
                    borderRadius: "50%",
                    p: 0,
                    ":hover": {
                      backgroundColor: color,
                      border: "4px dashed white",
                    },
                    border: color == course.color ? "4px dashed white" : "none",
                  }}
                  onClick={() => {
                    changeColor(course, color);
                    setOpen(false);
                  }}
                />
              </Grid>
            ))}
          </Grid>
          {/* Google Drive URL */}
          <Typography level="title-md" startDecorator={<FaGoogleDrive />}>
            Google Drive URL
          </Typography>
          <Input
            placeholder="Google Drive URL"
            value={course.googleDriveURL}
            onChange={(e) => {
              changeGoogleDriveURL(course, e.target.value);
            }}
          />
        </ModalDialog>
      </Modal>
      <Chip
        key={index}
        sx={{
          color: course.color,
          fontWeight: "bold",
        }}
        onClick={() => {
          setOpen(true);
        }}
        endDecorator={
          <ChipDelete
            onClick={() => {
              // Bring up confirmation modal IF there are deadlines with this course
              if (
                deadlines.some((deadline) => deadline.course === course.name) ||
                archived.some((deadline) => deadline.course === course.name)
              ) {
                if (
                  !window.confirm(
                    "Are you sure you want to delete this course? This will also delete all deadlines with this course. Even archived ones.\nTHIS CANNOT BE UNDONE."
                  )
                )
                  return;
              }
              removeCourse(course);
            }}
          />
        }
      >
        {course.name}
      </Chip>
    </>
  );
}
