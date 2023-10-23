import { useEffect, useState } from "react";
import axios from "axios";
import {
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  Dropdown,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  Modal,
  ModalClose,
  ModalDialog,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import {
  FaArchive,
  FaBook,
  FaCalendarAlt,
  FaCalendarPlus,
  FaEdit,
  FaExclamationTriangle,
  FaList,
  FaUser,
} from "react-icons/fa";
import NewDeadlineForm from "./components/NewDeadlineForm";
import DeadlinesList from "./DeadlinesList";
import ArchiveList from "./ArchiveList";
import Courses from "./Courses";
import Deadline from "./classes/deadline";
import logo from "../public/512_full.png";
import Calendar from "./Calendar";
import Settings from "./classes/settings";
import SettingsModal from "./components/SettingsModal";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";

export default function App() {
  // Deadlines
  const [deadlines, setDeadlines] = useState(() => {
    let localValue = JSON.parse(localStorage.getItem("deadlines"));
    if (localValue == null) return [];
    // Replace "Assignment" deadlines with "Hand-in" deadlines TODO: remove this in the future
    return localValue.map((deadline) => {
      if (deadline.type === "Assignment" || deadline.type === "") {
        deadline.type = "Hand-in";
      }
      return deadline;
    });
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

  // Settings
  const [settings, setSettings] = useState(() => {
    const localValue = JSON.parse(
      localStorage.getItem("settings"),
      (key, value) => {
        // ensure no legacy settings are loaded
        if (key === "") return new Settings(value);
        return value;
      }
    );
    if (localValue == null) return new Settings({});
    return localValue;
  });
  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  // Google sign in TODO: ADD open-state and menu for user sign in
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState(() => {
    const localValue = JSON.parse(sessionStorage.getItem("profile"));
    if (localValue == null) return null;
    return localValue;
  });
  // Save this session
  useEffect(() => {
    sessionStorage.setItem("profile", JSON.stringify(profile));
  }, [profile]);

  const login = useGoogleLogin({
    onSuccess: (response) => setUser(response),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user && user.access_token) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          setProfile(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

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
        {/* Title */}
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
        {/* Settings Modal */}
        <SettingsModal settings={settings} setSettings={setSettings} />
        {/* Account Menu */}
        <Dropdown>
          <MenuButton variant="plain">
            {profile && profile.picture ? (
              <img
                src={profile.picture}
                alt="profile"
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <FaUser />
            )}
          </MenuButton>
          <Menu variant="plain">
            {profile ? (
              <>
                <ListItem>
                  <Typography level="body-sm">{profile.email}</Typography>
                </ListItem>
                <MenuItem
                  color="danger"
                  onClick={() => {
                    googleLogout();
                    setProfile(null);
                  }}
                >
                  Log Out
                </MenuItem>
              </>
            ) : (
              <MenuItem color="primary" onClick={() => login()}>
                Log In
              </MenuItem>
            )}
          </Menu>
        </Dropdown>
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
            settings={settings}
          />
        </Stack>
        {/* Calendar VIEW */}
        {settings.view.includes("calendar") && (
          <>
            <Typography
              level="title-lg"
              startDecorator={<FaCalendarAlt />}
              sx={{ mt: 2 }}
            >
              Calendar
            </Typography>
            <Typography level="body-md" sx={{ textAlign: "center" }}>
              Click a deadline to see details, or drag and drop to move it.
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                alignItems: "center",
              }}
            >
              <Typography level="body-sm" sx={{ textAlign: "center" }}>
                Click a date to add a new deadline.
              </Typography>
            </Box>
            {/* Calendar */}
            <Box
              sx={{
                width: { xs: "98%", sm: "90%", md: "70%", lg: "60%" },
                mt: 2,
              }}
            >
              <Calendar
                archived={archived}
                setArchived={setArchived}
                deadlines={deadlines}
                courses={courses}
                setDeadlines={setDeadlines}
                settings={settings}
              />
            </Box>
          </>
        )}
        {/* Deadlines LIST */}
        {settings.view.includes("list") && (
          <>
            <Typography
              level="title-lg"
              startDecorator={<FaList />}
              sx={{ mt: 3 }}
            >
              Deadlines
            </Typography>
            <Typography level="body-md">
              View and manage your deadlines.
            </Typography>
            <Sheet
              sx={{
                width: { xs: "100%", sm: "90%", md: "80%", lg: "60%" },
                mt: 2,
              }}
            >
              <DeadlinesList
                deadlines={deadlines}
                setDeadlines={setDeadlines}
                archived={archived}
                setArchived={setArchived}
                courses={courses}
                settings={settings}
              />
            </Sheet>
          </>
        )}
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
  const hasCourses = props.courses.length != 0;
  const [open, setOpen] = useState(false);
  return (
    <>
      <Badge invisible={hasCourses} badgeContent={"Add Course!"} color="danger">
        <Button
          variant="outlined"
          color="purple"
          startDecorator={<FaBook />}
          onClick={() => setOpen(true)}
        >
          Manage Courses
        </Button>
      </Badge>
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
    if (localValue == null) return new Deadline({});
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
        disabled={courses.length === 0}
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
      <Badge
        invisible={props.archived.length === 0}
        badgeContent={props.archived.length}
        color="warning"
        variant="outlined"
      >
        <Button
          disabled={props.archived.length === 0}
          id="archived-button"
          variant="outlined"
          color="warning"
          startDecorator={<FaArchive />}
          onClick={() => setOpen(true)}
          sx={{ width: "100%" }}
        >
          Archived
        </Button>
      </Badge>
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
