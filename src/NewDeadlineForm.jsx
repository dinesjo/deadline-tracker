import {
  AspectRatio,
  Badge,
  Button,
  Input,
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";
import { FaBackspace } from "react-icons/fa";
import Deadline from "./deadline";
import SelectCourse from "./components/form-components/SelectCourse";
import SelectType from "./components/form-components/SelectType";

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
        <Badge invisible={newDeadline.title}>
          <Input
            required
            value={newDeadline.title}
            type="text"
            placeholder="Title"
            onChange={(e) =>
              setNewDeadline({ ...newDeadline, title: e.target.value })
            }
            sx={{ width: "100%" }}
          />
        </Badge>
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
          clearValue={() => {
            setNewDeadline((current) => ({
              ...current,
              type: null,
            }));
          }}
        />
        {/* Date */}
        <Badge invisible={newDeadline.date}>
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
            sx={{
              width: "100%",
            }}
          />
        </Badge>
        {/* Submit */}
        <Button type="submit">Submit</Button>
        {/* Required disclaimer */}
        <Typography
          level="body-xs"
          startDecorator={
            <AspectRatio
              ratio={1}
              sx={{
                borderRadius: "50%",
                width: "12px",
              }}
              color="primary"
              variant="solid"
            />
          }
        >
          required
        </Typography>
      </Stack>
    </form>
  );
}
