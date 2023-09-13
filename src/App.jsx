import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalClose,
  ModalDialog,
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

const ManageCoursesModal = ({ ...props }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="solid"
        color="neutral"
        startDecorator={<FaBook />}
        onClick={() => setOpen(true)}
      >
        Manage Courses
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <ModalDialog>
          <ModalClose />
          <Typography level="title-lg" startDecorator={<FaBook />}>
            Manage Courses
          </Typography>
          <Typography level="body-md" sx={{ mb: 2 }}>
            Add, rename, and remove courses.
          </Typography>
          <Courses open={open} setOpen={setOpen} {...props} />
        </ModalDialog>
      </Modal>
    </>
  );
};

const NewDeadlineFormModal = ({ courses, setDeadlines }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="solid"
        color="primary"
        startDecorator={<FaCalendarPlus />}
        onClick={() => setOpen(true)}
      >
        New Deadline
      </Button>
      <Modal
        open={open}
        onClose={(_event, reason) => {
          // Don't close modal if user pressed escape key
          // (because that's how some users will close the date picker and Select)
          if (reason !== "escapeKeyDown") setOpen(false);
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <ModalDialog>
          <ModalClose />
          <Typography
            level="title-lg"
            startDecorator={<FaCalendarPlus />}
            sx={{ mb: 2 }}
          >
            New Deadline
          </Typography>
          <NewDeadlineForm
            open={open}
            setOpen={setOpen}
            courses={courses}
            setDeadlines={setDeadlines}
          />
        </ModalDialog>
      </Modal>
    </>
  );
};

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
      {/* "navbar" */}
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{ width: "100vw", px: 2, py: 1 }}
      >
        <ModeToggle />
      </Stack>

      {/* Main content */}
      <Sheet
        sx={{
          width: "100vw",
          minHeight: "100vh",
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
          {/* Manage Courses modal */}
          <ManageCoursesModal
            courses={courses}
            setCourses={setCourses}
            deadlines={deadlines}
            setDeadlines={setDeadlines}
          />
          <NewDeadlineFormModal courses={courses} setDeadlines={setDeadlines} />
        </Stack>

        {/* Deadlines LIST */}
        <Typography
          level="title-lg"
          startDecorator={<FaCalendarAlt />}
          sx={{ mt: 3 }}
        >
          Deadlines
        </Typography>
        <Typography level="body-md">View and manage your deadlines.</Typography>
        <DeadlinesList
          deadlines={deadlines}
          setDeadlines={setDeadlines}
          setArchived={setArchived}
          courses={courses}
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
