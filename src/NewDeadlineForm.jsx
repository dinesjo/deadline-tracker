import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Button,
  Input,
  Option,
  Select,
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";

export default function NewDeadlineForm({ setDeadlines }) {
  const [newDeadline, setNewDeadline] = useState({
    title: "",
    details: "",
    date: new Date().toISOString().slice(0, 10),
    type: "",
    status: "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDeadlines((current) => [
          ...current,
          {
            title: newDeadline.title,
            details: newDeadline.details,
            date: newDeadline.date,
            type: newDeadline.type,
            status: "Not Started",
          },
        ]);
      }}
    >
      <Stack spacing={0.5}>
        <Typography startDecorator={<FaPlus />} variant="h4">
          New Deadline
        </Typography>
        <Input
          required
          value={newDeadline.title}
          type="text"
          placeholder="Title"
          onChange={(e) =>
            setNewDeadline({ ...newDeadline, title: e.target.value })
          }
        />
        <Textarea
          value={newDeadline.details}
          type="textarea"
          placeholder="Details"
          onChange={(e) =>
            setNewDeadline({ ...newDeadline, details: e.target.value })
          }
        />
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
        <Select
          onChange={(e) => {
            e &&
              setNewDeadline({
                ...newDeadline,
                type: e.target.textContent,
              });
          }}
          placeholder="Type"
        >
          <Option value="lab" color="primary" variant="plain">
            Lab
          </Option>
          <Option value="assignment" color="warning" variant="plain">
            Assignment
          </Option>
          <Option value="exam" color="danger" variant="plain">
            Exam
          </Option>
        </Select>
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
}
