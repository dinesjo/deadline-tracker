import {
  Option,
  Select,
} from "@mui/joy";

export default function SelectCourse({ deadline, onChange, courses }) {
  return (
    <Select
      required
      onChange={onChange}
      placeholder="Course"
      value={deadline.course}
      sx={{
        color: courses.find((course) => course.name === deadline.course)?.color,
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
  );
}
