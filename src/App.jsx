import { useEffect, useState } from "react";
import {
  Button,
  Sheet,
  Stack,
  Tooltip,
  Typography,
  useColorScheme,
} from "@mui/joy";
import {
  FaArchive,
  FaBook,
  FaCalendarAlt,
  FaCalendarPlus,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import NewDeadlineForm from "./NewDeadlineForm";
import DeadlinesList from "./DeadlinesList";
import ArchiveList from "./ArchiveList";
import Courses from "./Courses";

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
  // Deadlines
  const [deadlines, setDeadlines] = useState(() => {
    const localValue = JSON.parse(localStorage.getItem("deadlines"));
    if (localValue == null) return [];
    return localValue;
  });
  useEffect(() => {
    localStorage.setItem("deadlines", JSON.stringify(deadlines));
  }, [deadlines]);

  // Archive
  const [archived, setArchived] = useState(() => {
    const localValue = JSON.parse(localStorage.getItem("archived"));
    if (localValue == null) return [];
    return localValue;
  });
  useEffect(() => {
    localStorage.setItem("archived", JSON.stringify(archived));
  }, [archived]);

  // Courses
  const [courses, setCourses] = useState(() => {
    const localValue = JSON.parse(localStorage.getItem("courses"));
    if (localValue == null) return [];
    return localValue;
  });
  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

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
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ pt: 2, maxWidth: "80%" }}
        >
          <Sheet sx={{ width: "50%" }}>
            {/* Courses */}
            <Typography level="title-lg" startDecorator={<FaBook />}>
              Courses
            </Typography>
            <Typography level="body-md">
              Add and manage your courses.
            </Typography>
            <Courses courses={courses} setCourses={setCourses} />
          </Sheet>
          <Sheet sx={{ width: "50%" }}>
            {/* Deadlines FORM */}
            <Typography startDecorator={<FaCalendarPlus />} level="title-lg">
              New Deadline
            </Typography>
            <Typography level="body-md">Add a new deadline.</Typography>
            <NewDeadlineForm setDeadlines={setDeadlines} courses={courses} />
          </Sheet>
        </Stack>

        {/* Deadlines LIST */}
        <Typography
          level="title-lg"
          startDecorator={<FaCalendarAlt />}
          sx={{ mt: 2 }}
        >
          Deadlines
        </Typography>
        <Typography level="body-md">View and manage your deadlines.</Typography>
        <DeadlinesList
          deadlines={deadlines}
          setDeadlines={setDeadlines}
          setArchived={setArchived}
        />

        {/* Archived Deadlines */}
        {archived.length != 0 && (
          <Typography level="title-lg" startDecorator={<FaArchive />}>
            Archived
          </Typography>
        )}
        <ArchiveList
          archived={archived}
          setArchived={setArchived}
          setDeadlines={setDeadlines}
        />
      </Sheet>
    </>
  );
}

export default App;
