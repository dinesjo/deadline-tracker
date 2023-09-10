import { useEffect, useState } from "react";
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
  Stack,
  Textarea,
  Tooltip,
  Typography,
  useColorScheme,
} from "@mui/joy";
import {
  FaArchive,
  FaArrowUp,
  FaBoxOpen,
  FaCalendar,
  FaCalendarDay,
  FaLongArrowAltUp,
  FaMinusSquare,
  FaMoon,
  FaPlusSquare,
  FaSun,
  FaTrashAlt,
} from "react-icons/fa";
import NewDeadlineForm from "./NewDeadlineForm";
import DeadlinesList from "./DeadlinesList";

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
  const [deadlines, setDeadlines] = useState(() => {
    const localValue = JSON.parse(localStorage.getItem("deadlines"));
    if (localValue == null) return [];
    return localValue;
  });
  useEffect(() => {
    localStorage.setItem("deadlines", JSON.stringify(deadlines));
  }, [deadlines]);

  const [archived, setArchived] = useState(() => {
    const localValue = JSON.parse(localStorage.getItem("archived"));
    if (localValue == null) return [];
    return localValue;
  });
  useEffect(() => {
    localStorage.setItem("archived", JSON.stringify(archived));
  }, [archived]);

  return (
    <>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{ width: "100vw", px: 2, py: 1 }}
      >
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
        {/* NEW DEADLINES FORM */}
        <NewDeadlineForm setDeadlines={setDeadlines} />

        <Divider sx={{ width: "100%", my: 1 }} />

        {/* DEADLINES LIST */}
        <Typography level="title-lg" startDecorator={<FaCalendar />}>
          Deadlines
        </Typography>
        <DeadlinesList
          deadlines={deadlines}
          setDeadlines={setDeadlines}
          setArchived={setArchived}
        />

        {/* ARCHIVED DEADLINES */}
        <Typography level="title-lg" startDecorator={<FaArchive />}>
          Archived
        </Typography>
        <List
          sx={{
            width: "80%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {archived.map((deadline, index) => (
            <ListItem key={index}>
              <Card
                variant="soft"
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CardContent>
                  <Typography variant="h4">{deadline.title}</Typography>
                  <Typography variant="body-md">
                    {deadline.date && (
                      <>
                        <Typography
                          startDecorator={<FaCalendarDay />}
                          level="body-sm"
                          color="primary"
                        >
                          {deadline.date}
                        </Typography>
                      </>
                    )}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    startDecorator={<FaBoxOpen />}
                    variant="plain"
                    color="primary"
                    onClick={() => {
                      setArchived((prev) => {
                        const newArchived = [...prev];
                        newArchived.splice(index, 1);
                        return newArchived;
                      });
                      setDeadlines((prev) => {
                        const newDeadlines = [...prev];
                        newDeadlines.push(deadline);
                        return newDeadlines;
                      });
                    }}
                  >
                    Unarchive
                  </Button>
                  <Button
                    startDecorator={<FaTrashAlt />}
                    variant="plain"
                    color="danger"
                    onClick={() => {
                      setArchived((prev) => {
                        const newArchived = [...prev];
                        newArchived.splice(index, 1);
                        return newArchived;
                      });
                    }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </ListItem>
          ))}
        </List>
      </Sheet>
    </>
  );
}

export default App;
