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
import types from "./types";

export default function NewDeadlineForm({ setDeadlines, ...props }) {
  const [newDeadline, setNewDeadline] = useState({
    title: "",
    details: "",
    date: new Date().toISOString().slice(0, 10),
    type: "",
    status: "",
    id: "",
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
            id: crypto.randomUUID(),
          },
        ]);
        console.log("New deadline submitted:", newDeadline);
      }}
    >
      <Stack
        spacing={0.5}
        {...props}
      >
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
          sx={{ height: "4em", overflow: "hidden", resize: "vertical" }}
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
            <Typography startDecorator={types.icon["Lab"]}>Lab</Typography>
          </Option>
          <Option value="assignment" color="warning" variant="plain">
            <Typography startDecorator={types.icon["Assignment"]}>
              Assignment
            </Typography>
          </Option>
          <Option value="exam" color="danger" variant="plain">
            <Typography startDecorator={types.icon["Exam"]}>Exam</Typography>
          </Option>
        </Select>
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
}
