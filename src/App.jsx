import { useRef, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardOverflow,
  Chip,
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
  FaCheckCircle,
  FaCross,
  FaEraser,
  FaHeading,
  FaMinus,
  FaMoon,
  FaPencilAlt,
  FaPlus,
  FaQuoteLeft,
  FaSun,
  FaTrash,
  FaXbox,
} from "react-icons/fa";

const StatusChip = ({ status }) => {
  return (
    <Chip
      variant="solid"
      color={
        status === "Not Started"
          ? "neutral"
          : status === "In Progress"
          ? "warning"
          : "success"
      }
      startDecorator={
        status === "Not Started" ? (
          <FaBorderAll />
        ) : status === "In Progress" ? (
          <FaPencilAlt />
        ) : (
          <FaCheckCircle />
        )
      }
      onClick={() => {}}
    >
      {status}
    </Chip>
  );
};

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
  const [type, setType] = useState("");
  const action = useRef(null);
  const [deadlines, setDeadlines] = useState([
    {
      title: "Title",
      details:
        "Lämnas in fysiskt på övningen. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget ultricies ultrices, nunc nisl ultricies nisl, vitae ultricies nisl nisl eget nisl. Donec euismod, nisl eget ultricies ultrices, nunc nisl ultricies nisl, vitae ultricies nisl nisl eget nisl.",
      date: "2023-09-11",
      type: "Assignment",
      status: "In Progress",
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
                date: e.target[3].value,
                type: e.target[4].outerText,
                status: "Not Started",
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
              defaultValue={new Date().toISOString().slice(0, 10)}
            />
            <Select
              action={action}
              value={type}
              placeholder="Type..."
              onChange={(e, newValue) => setType(newValue)}
              {...(type && {
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
                      setType(null);
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
              <Option value="lab" color="primary" variant="plain">
                Lab
              </Option>
              <Option value="assignment" color="warning" variant="plain">
                Assignment
              </Option>
              <Option value="quiz" color="success" variant="plain">
                Quiz
              </Option>
              <Option value="exam" color="danger" variant="plain">
                Exam
              </Option>
            </Select>
            <Button type="submit">Submit</Button>
          </Stack>
        </form>
        <Divider sx={{ width: "100%", my: 1 }} />
        <List>
          {deadlines.map((deadline, index) => (
            <ListItem key={index}>
              <Card
                variant="soft"
                sx={{
                  maxWidth: 500,
                  overflow: "auto",
                  resize: "horizontal",
                }}
              >
                <CardContent>
                  <Box display={"flex"} justifyContent="space-between">
                    <Typography level="title-lg">
                      {deadline.title.toUpperCase()}
                    </Typography>
                    <Chip variant="solid" color="neutral">
                      {deadline.type}
                    </Chip>
                  </Box>
                  <Typography startDecorator={<FaCalendarDay />}>
                    {deadline.date}
                  </Typography>
                  <Typography level="body-md">{deadline.details}</Typography>
                  <CardActions buttonFlex="0 1 120px">
                    <Button variant="solid" color="primary">
                      Docs
                    </Button>
                    <IconButton
                      variant="soft"
                      color="danger"
                      sx={{ ml: "auto" }}
                    >
                      <FaTrash />
                    </IconButton>
                  </CardActions>
                </CardContent>
                <CardOverflow>
                  <Divider inset="context" />
                  <CardContent
                    orientation="horizontal"
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <StatusChip status={deadline.status} />
                    <Typography
                      startDecorator={<FaCalendarDay />}
                      fontWeight="md"
                      color="primary"
                    >
                      {Math.ceil(
                        (new Date(deadline.date).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      day(s) left
                    </Typography>
                  </CardContent>
                </CardOverflow>
              </Card>
            </ListItem>
          ))}
        </List>
      </Sheet>
    </>
  );
}

export default App;
