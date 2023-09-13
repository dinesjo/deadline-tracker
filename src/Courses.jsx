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

export default function Courses({ courses, setCourses }) {
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
              fontWeight: "bold",
            }}
            endDecorator={
              <ChipDelete
                onClick={() => {
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
