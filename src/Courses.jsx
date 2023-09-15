import {
  Alert,
  Box,
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
import { FaPlus } from "react-icons/fa";

const colorCodes = [
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

const CourseChip = ({
  course,
  index,
  renameCourse,
  removeCourse,
  setCourses,
  changeColor,
}) => {
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
          <Typography level="title-md">Edit Course</Typography>
          <Input
            placeholder="Course Name"
            value={course.name}
            onChange={(e) => {
              renameCourse(index, e.target.value);
            }}
          />
          <Typography level="title-md" sx={{ mt: 1 }}>
            Change color
          </Typography>
          <Grid
            container
            spacing={1}
            sx={{ mt: 1, display: "flex", justifyContent: "center" }}
          >
            {colorCodes.map((color, i) => (
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
                    changeColor(index, color);
                    setOpen(false);
                  }}
                />
              </Grid>
            ))}
          </Grid>
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
              removeCourse(index);
            }}
          />
        }
      >
        {course.name}
      </Chip>
    </>
  );
};

export default function Courses({
  courses,
  setCourses,
  deadlines,
  setDeadlines,
  archived,
  setArchived,
}) {
  const [newCourse, setNewCourse] = useState({
    name: "", // unique
    color: "",
  });
  const addCourse = (name) => {
    // Require unique name
    if (name === "" || courses.some((course) => course.name === name)) return; // TODO: Show error message

    // Add new course
    setCourses((current) => [
      ...current,
      {
        name: name,
        color: getRandomColorCode(),
      },
    ]);

    // Reset user input state
    setNewCourse({ name: "", color: "" });
  };
  const renameCourse = (index, newName) => {
    // Require unique name
    if (newName === "" || courses.some((course) => course.name === newName))
      return; // TODO: Show error message

    // Rename course
    setCourses((current) => {
      return current.map((course, i) => {
        if (i === index) {
          return { ...course, name: newName };
        }
        return course;
      });
    });

    // Update deadlines with this course
    setDeadlines((current) => {
      return current.map((deadline) => {
        if (deadline.course === courses[index].name) {
          return { ...deadline, course: newName };
        }
        return deadline;
      });
    });
  };
  const changeColor = (index, color) => {
    setCourses((current) => {
      return current.map((course, i) => {
        if (i === index) {
          return { ...course, color: color };
        }
        return course;
      });
    });
  };
  const removeCourse = (index) => {
    setCourses((current) => {
      return current.filter((_, i) => i !== index);
    });
    // Remove deadlines with this course
    setDeadlines((current) => {
      return current.filter(
        (deadline) => deadline.course !== courses[index].name
      );
    });
    // Remove archived with this course
    setArchived((current) => {
      return current.filter(
        (deadline) => deadline.course !== courses[index].name
      );
    });
  };
  const getRandomColorCode = () => {
    // Get random color code
    const color = colorCodes[Math.floor(Math.random() * colorCodes.length)];

    // Try again if color is already used and there are more colors available
    if (
      colorCodes.length > courses.length &&
      courses.some((course) => course.color === color)
    )
      return getRandomColorCode();

    return color;
  };

  return (
    <>
      <Input
        placeholder="Course Name"
        endDecorator={
          <IconButton
            onClick={() => {
              addCourse(newCourse.name);
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
            addCourse(newCourse.name);
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
          <Alert variant="soft" color="neutral">
            <Box>
              <Typography level="title-lg">No Courses</Typography>
              <Typography level="body-sm">
                You have no courses. Add one from above.
              </Typography>
            </Box>
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
              setCourses={setCourses}
            />
          ))}
      </Stack>
    </>
  );
}
