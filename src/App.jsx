import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  Divider,
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
  FaEdit,
  FaExclamationTriangle,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import NewDeadlineForm from "./NewDeadlineForm";
import DeadlinesList from "./DeadlinesList";
import ArchiveList from "./ArchiveList";
import Courses from "./Courses";
import Deadline from "./deadline";
import logo from "../public/512.png";

export default function App() {
  // Deadlines
  const [deadlines, setDeadlines] = useState(() => {
    let localValue = JSON.parse(localStorage.getItem("deadlines"));
    if (localValue == null) return [];
    // Replace "Assignment" deadlines with "Hand-in" deadlines TODO: remove this in the future
    localValue = localValue.map((deadline) => {
      if (deadline.type === "Assignment" || deadline.type === "") {
        deadline.type = "Hand-in";
      }
      return deadline;
    });
    return localValue;
  });
  useEffect(() => {
    localStorage.setItem("deadlines", JSON.stringify(deadlines));
  }, [deadlines]);

  // Archive
  const [archived, setArchived] = useState(() => {
    let localValue = JSON.parse(localStorage.getItem("archived"));
    if (localValue == null) return [];
    // Replace "Assignment" deadlines with "Hand-in" deadlines TODO: remove this in the future
    localValue = localValue.map((deadline) => {
      if (deadline.type === "Assignment" || deadline.type === "") {
        deadline.type = "Hand-in";
      }
      return deadline;
    });
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
        sx={{
          width: "100vw",
          py: 1,
        }}
      >
        <Typography
          startDecorator={
            <img
              src={logo}
              alt="logo"
              style={{ width: "30px", height: "30px" }}
            />
          }
          level="title-lg"
        >
          Deadline Tracker
        </Typography>
        <ModeToggle />
      </Stack>

      {/* Main content */}
      <Sheet
        sx={{
          width: "100vw",
          minHeight: "calc(100vh - 63px)", // subtract height of navbar
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "background.body",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ pt: 2, maxWidth: "80%" }}
        >
          {/* Manage Courses */}
          <ManageCoursesModal
            courses={courses}
            setCourses={setCourses}
            deadlines={deadlines}
            setDeadlines={setDeadlines}
            archived={archived}
            setArchived={setArchived}
          />
          {/* New form */}
          <NewDeadlineFormModal courses={courses} setDeadlines={setDeadlines} />
          {/* Archive */}
          <ArchiveModal
            archived={archived}
            setArchived={setArchived}
            setDeadlines={setDeadlines}
            courses={courses}
          />
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
        <Sheet
          sx={{ width: { xs: "100%", sm: "90%", md: "80%", lg: "60%" }, mt: 2 }}
        >
          <DeadlinesList
            deadlines={deadlines}
            setDeadlines={setDeadlines}
            setArchived={setArchived}
            courses={courses}
          />
        </Sheet>
      </Sheet>

      {/* Footer */}
      <Divider />
      <Sheet
        sx={{
          position: "relative",
          bottom: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Alert
          variant="plain"
          color="warning"
          sx={{
            textAlign: "center",
            borderRadius: 0,
          }}
          startDecorator={<FaExclamationTriangle />}
        >
          Please note that data is stored locally in your browser. If you clear
          your browser data, your deadlines will be lost.
        </Alert>
      </Sheet>
    </>
  );
}

function ManageCoursesModal({ ...props }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="outlined"
        color="purple"
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
          <Typography level="body-md">
            Add, edit, and remove courses.
          </Typography>
          <Alert
            variant="soft"
            color="primary"
            size="md"
            sx={{ mt: 1, mb: 1.5 }}
            startDecorator={<FaEdit />}
          >
            <Typography level="title-md">Click a course to edit it</Typography>
          </Alert>
          <Courses open={open} setOpen={setOpen} {...props} />
        </ModalDialog>
      </Modal>
    </>
  );
}

function NewDeadlineFormModal({ courses, setDeadlines }) {
  const [open, setOpen] = useState(false);
  const [newDeadline, setNewDeadline] = useState(() => {
    const localValue = JSON.parse(sessionStorage.getItem("newDeadline"));
    if (localValue == null) return new Deadline();
    return localValue;
  });

  useEffect(() => {
    if (!open) {
      sessionStorage.setItem("newDeadline", JSON.stringify(newDeadline));
    }
  }, [open, newDeadline]);

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
            newDeadline={newDeadline}
            setNewDeadline={setNewDeadline}
          />
        </ModalDialog>
      </Modal>
    </>
  );
}

function ArchiveModal({ ...props }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="outlined"
        color="brown"
        startDecorator={<FaArchive />}
        onClick={() => setOpen(true)}
      >
        Archived
        <Chip variant="outlined" size="sm" color="neutral" sx={{ ml: 1 }}>
          {props.archived.length}
        </Chip>
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <ModalDialog>
          <ModalClose />
          <Typography level="title-lg" startDecorator={<FaArchive />}>
            Archived
          </Typography>
          <Typography level="body-md" sx={{ mb: 2 }}>
            View and restore archived deadlines.
          </Typography>
          <ArchiveList {...props} />
        </ModalDialog>
      </Modal>
    </>
  );
}

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
