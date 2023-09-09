import { useRef, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Input,
  List,
  ListItem,
  Option,
  Select,
  Sheet,
  Slider,
  Stack,
  Switch,
  Textarea,
  Tooltip,
  Typography,
  useColorScheme,
} from "@mui/joy";
import {
  FaBorderAll,
  FaCalendarDay,
  FaCross,
  FaEraser,
  FaHeading,
  FaMinus,
  FaMoon,
  FaPencilAlt,
  FaPlus,
  FaQuoteLeft,
  FaSun,
  FaXbox,
} from "react-icons/fa";

function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  // necessary for server-side rendering
  // because mode is undefined on the server
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  return (
    <Tooltip
      title={mode === "light" ? "Dark Mode" : "Light Mode"}
      variant="soft"
    >
      <Button
        variant="plain"
        color="neutral"
        onClick={() => {
          setMode(mode === "light" ? "dark" : "light");
        }}
      >
        {mode === "light" ? <FaMoon /> : <FaSun />}
      </Button>
    </Tooltip>
  );
}

function App() {
  const [value, setValue] = useState("");
  const action = useRef(null);
  const [deadlines, setDeadlines] = useState([
    {
      title: "Title",
      details:
        "Lämnas in fysiskt på övningen aljdhalkjs jdla slkdj alksjl jalksjl k",
      date: "2023-10-10",
      type: "Assignment",
    },
  ]);

  return (
    <>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{ width: "100vw", px: 2, py: 2.5 }}
      >
        <Divider orientation="vertical" />
        <ModeToggle />
      </Stack>
      <Sheet
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form
          onSubmit={(e) => {
            console.log(e);
            e.preventDefault();
            setDeadlines([
              ...deadlines,
              {
                title: e.target[0].value,
                details: e.target[1].value,
                date: e.target[3].innerHTML,
                type: e.target[4].value,
              },
            ]);
          }}
        >
          <Stack spacing={0.5}>
            <Typography startDecorator={<FaPlus />} variant="h4">
              New Deadline
            </Typography>
            <Input required placeholder="Title..." type="text" />
            <Textarea placeholder="Details..." sx={{ minHeight: 100 }} />
            <Input
              type="date"
              slotProps={{
                input: {
                  min: "2023-09-10T00:00",
                },
              }}
            />
            <Select
              action={action}
              value={value}
              placeholder="Type..."
              onChange={(e, newValue) => setValue(newValue)}
              {...(value && {
                // display the button and remove select indicator
                // when user has selected a value
                endDecorator: (
                  <IconButton
                    size="sm"
                    variant="plain"
                    color="danger"
                    onMouseDown={(event) => {
                      // don't open the popup when clicking on this button
                      event.stopPropagation();
                    }}
                    onClick={() => {
                      setValue(null);
                      action.current?.focusVisible();
                    }}
                  >
                    <FaMinus />
                  </IconButton>
                ),
                indicator: null,
              })}
              sx={{ minWidth: 160 }}
            >
              <Option value="lab">Lab</Option>
              <Option value="assignment">Assignment</Option>
              <Option value="quiz">Quiz</Option>
              <Option value="exam">Exam</Option>
            </Select>
            <Button type="submit">Submit</Button>
          </Stack>
        </form>
        <List>
          {deadlines.map((deadline, index) => (
            <ListItem key={index}>
              <Card>
                <Stack direction="column" justifyContent="space-between">
                  <Typography startDecorator={<FaHeading />}>
                    {deadline.title.toUpperCase()}
                  </Typography>
                  <Typography maxWidth={300} startDecorator={<FaQuoteLeft />}>
                    {deadline.details}
                  </Typography>
                  <Typography startDecorator={<FaCalendarDay />}>
                    {deadline.date}
                  </Typography>
                  <Typography startDecorator={<FaEraser />}>
                    {deadline.type}
                  </Typography>
                </Stack>
              </Card>
            </ListItem>
          ))}
        </List>
      </Sheet>
    </>
  );
}

export default App;
