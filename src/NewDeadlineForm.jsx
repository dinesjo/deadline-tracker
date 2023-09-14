import { useState } from "react";
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
import { FaBackspace, FaBroom } from "react-icons/fa";

export default function NewDeadlineForm({
  setDeadlines,
  courses,
  setOpen,
  newDeadline,
  setNewDeadline,
  ...props
}) {
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
            course: newDeadline.course,
            status: "Not Started",
            id: crypto.randomUUID(),
          },
        ]);
        console.log("New deadline submitted:", newDeadline);
        // Reset user input state
        setNewDeadline({
          title: "",
          details: "",
          date: new Date().toISOString().slice(0, 10),
          type: "",
          course: "",
          status: "",
          id: "",
        });
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
          setNewDeadline({
            title: "",
            details: "",
            date: new Date().toISOString().slice(0, 10),
            type: "",
            course: "",
            status: "",
            id: "",
          });
        }}
      >
        Clear form
      </Button>

      <Stack spacing={0.5} {...props}>
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
        {/* Type */}
        <Select
          onChange={(e) => {
            e &&
              setNewDeadline({
                ...newDeadline,
                type: e.target.textContent,
              });
          }}
          placeholder="Type"
          value={newDeadline.type}
          startDecorator={
            newDeadline.type && (
              // Icon for selected item
              <ListItemDecorator
                sx={{
                  color: types.find((type) => type.name === newDeadline.type)
                    ?.color,
                }}
              >
                {types.find((type) => type.name === newDeadline.type)?.icon}
              </ListItemDecorator>
            )
          }
          sx={{
            color: types.find((type) => type.name === newDeadline.type)?.color,
          }}
        >
          {types.map((type, index) => (
            <Option key={index} value={type.name} sx={{ color: type.color }}>
              <ListItemDecorator>{type.icon}</ListItemDecorator>
              {type.name}
            </Option>
          ))}
        </Select>
        {/* Course */}
        <Select
          required
          onChange={(e) => {
            e &&
              setNewDeadline({
                ...newDeadline,
                course: e.target.textContent,
              });
          }}
          placeholder="Course"
          value={newDeadline.course}
          sx={{
            color: courses.find((course) => course.name === newDeadline.course)
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
        {/* Submit */}
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
}
