import {
  Alert,
  Box,
  Button,
  Chip,
  ChipDelete,
  IconButton,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { FaPalette, FaPlus } from "react-icons/fa";

const colorCodes = [
  "#FF5733",
  "#3399FF",
  "#FFCC00",
  "#9933CC",
  "#FF5577",
  "#33FF99",
  "#CC66FF",
  "#66CC33",
  "#FF9900",
];

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
            <Chip
              key={index}
              sx={{
                color: course.color,
              }}
              onClick={() => {
                // Rename course
                const newName = prompt("New name:", course.name);
                if (
                  newName &&
                  newName !== "" &&
                  !courses.some((course) => course.name === newName)
                ) {
                  // Rename
                  renameCourse(index, newName);
                }
              }}
              endDecorator={
                <ChipDelete
                  onClick={() => {
                    // Bring up confirmation modal IF there are deadlines with this course
                    if (
                      deadlines.some(
                        (deadline) => deadline.course === course.name
                      ) ||
                      archived.some(
                        (deadline) => deadline.course === course.name
                      )
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
          ))}
      </Stack>
    </>
  );
}
