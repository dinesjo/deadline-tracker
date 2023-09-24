import { Badge, Option, Select } from "@mui/joy";

export default function SelectCourse({ deadline, onChange, courses }) {
  return (
    <Badge invisible={deadline.course != null}>
      <Select
        required
        onChange={onChange}
        placeholder="Course"
        value={deadline.course}
        sx={{
          width: "100%",
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
    </Badge>
  );
}
