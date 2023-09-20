import {
  Button,
  Input,
  ListItemDecorator,
  Option,
  Select,
  Stack,
  Textarea,
} from "@mui/joy";
import types from "./types";
import { FaBackspace } from "react-icons/fa";
import Deadline from "./deadline";

export default function NewDeadlineForm({
  setDeadlines,
  courses,
  newDeadline,
  setNewDeadline,
  setOpen,
  ...props
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDeadlines((current) => [
          ...current,
          new Deadline(
            newDeadline.title,
            newDeadline.details,
            newDeadline.date,
            newDeadline.type,
            newDeadline.course,
            "Not Started",
            crypto.randomUUID()
          ),
        ]);
        console.log("New deadline submitted:", newDeadline);
        // Reset user input state
        setNewDeadline(new Deadline());
        setOpen(false); // close modal
      }}
    >
      {/* Clear form button */}
      <Button
        variant="soft"
        color="neutral"
        startDecorator={<FaBackspace />}
        sx={{
          mb: 2,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => {
          // Reset user input state
          setNewDeadline(new Deadline());
        }}
      >
        Clear form
      </Button>

      <Stack spacing={0.5} {...props}>
        {/* Course */}
        <SelectCourse
          deadline={newDeadline}
          setDeadline={setNewDeadline}
          courses={courses}
          onChange={(e) => {
            e &&
              setNewDeadline((current) => ({
                ...current,
                course: e.target.textContent,
              }));
          }}
        />
        {/* Title */}
        <Input
          required
          value={newDeadline.title}
          type="text"
          placeholder="Title"
          onChange={(e) =>
            setNewDeadline({ ...newDeadline, title: e.target.value })
          }
        />
        {/* Details */}
        <Textarea
          sx={{ height: "4em", overflow: "hidden", resize: "vertical" }}
          value={newDeadline.details}
          type="textarea"
          placeholder="Details"
          onChange={(e) =>
            setNewDeadline({ ...newDeadline, details: e.target.value })
          }
        />
        {/* Type */}
        <SelectType
          deadline={newDeadline}
          onChange={(e) => {
            e &&
              setNewDeadline({
                ...newDeadline,
                type: e.target.textContent,
              });
          }}
        />
        {/* Date */}
        <Input
          type="date"
          slotProps={{
            input: {
              min: "2023-09-10T00:00",
            },
          }}
          value={newDeadline.date}
          onChange={(e) =>
            setNewDeadline({ ...newDeadline, date: e.target.value })
          }
        />
        {/* Submit */}
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
}

export function SelectCourse({ deadline, onChange, courses }) {
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

export function SelectType({ deadline, onChange }) {
  const type = types.find((type) => type.name === deadline.type);

  return (
    <Select
      onChange={onChange}
      placeholder="Type"
      value={deadline.type}
      startDecorator={
        deadline.type && (
          // Icon for selected item
          <ListItemDecorator
            sx={{
              color: type?.color,
            }}
          >
            {type?.icon}
          </ListItemDecorator>
        )
      }
      sx={{
        color: type?.color,
      }}
    >
      {types.map((type, index) => (
        <Option key={index} value={type.name} sx={{ color: type.color }}>
          <ListItemDecorator>{type.icon}</ListItemDecorator>
          {type.name}
        </Option>
      ))}
    </Select>
  );
}
