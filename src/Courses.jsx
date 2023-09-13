import {
  Alert,
  Box,
  Chip,
  ChipDelete,
  IconButton,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

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

export default function Courses({ courses, setCourses, deadlines, setDeadlines }) {
  const [newCourse, setNewCourse] = useState({
    name: "", // unique
    color: "",
  });
  const addCourse = () => {
    if (
      newCourse.name === "" ||
      courses.some((course) => course.name === newCourse.name)
    )
      return; // TODO: Show error message
    setCourses((current) => [
      ...current,
      {
        name: newCourse.name,
        color: getRandomColorCode(),
      },
    ]);
    setNewCourse({ name: "", color: "" });
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
              addCourse();
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
            addCourse();
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
        {courses.map((course, index) => (
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
                // Update name
                setCourses((current) => {
                  const newCourses = [...current];
                  newCourses[index].name = newName;
                  return newCourses;
                });
              }
            }}
            endDecorator={
              <ChipDelete
                onClick={() => {
                  // Bring up confirmation modal IF there are deadlines with this course
                  if (
                    deadlines.some(
                      (deadline) => deadline.course === course.name
                    )
                  ) {
                    if (
                      !window.confirm(
                        "Are you sure you want to delete this course? This will also delete all deadlines with this course."
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
