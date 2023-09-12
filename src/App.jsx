import { useEffect, useState } from "react";
import {
  Button,
  Sheet,
  Stack,
  Tooltip,
  Typography,
  useColorScheme,
} from "@mui/joy";
import { FaArchive, FaCalendar, FaMoon, FaSun } from "react-icons/fa";
import NewDeadlineForm from "./NewDeadlineForm";
import DeadlinesList from "./DeadlinesList";
import ArchiveList from "./ArchiveList";

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
        <NewDeadlineForm setDeadlines={setDeadlines} sx={{ mt: 2 }} />

        {/* DEADLINES LIST */}
        <Typography
          level="title-lg"
          startDecorator={<FaCalendar />}
          sx={{ mt: 2 }}
        >
          Deadlines
        </Typography>
        <DeadlinesList
          deadlines={deadlines}
          setDeadlines={setDeadlines}
          setArchived={setArchived}
        />

        {/* ARCHIVED DEADLINES */}
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
