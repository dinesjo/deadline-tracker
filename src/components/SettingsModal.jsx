import {
  Badge,
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import {
  FaCalendarAlt,
  FaCog,
  FaGlobe,
  FaListAlt,
  FaMoon,
} from "react-icons/fa";
import DarkModeSwitch from "./DarkModeSwitch";

export default function SettingsModal({ settings, setSettings }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Badge
        badgeContent="New"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        color="success"
      >
        <IconButton
          variant="plain"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FaCog />
        </IconButton>
      </Badge>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ModalDialog>
          <ModalClose />
          <Typography
            level="title-lg"
            startDecorator={<FaCog />}
            sx={{ mb: 2 }}
          >
            Settings
          </Typography>
          <Stack spacing={2}>
            <FormControl
              orientation="horizontal"
              sx={{ justifyContent: "space-between" }}
            >
              <Box>
                <FormLabel>
                  <Typography
                    startDecorator={<FaCalendarAlt />}
                    level="inherit"
                  >
                    Calendar View
                  </Typography>
                </FormLabel>
                <FormHelperText>
                  Shows your deadlines on a calendar at the top of the app.
                </FormHelperText>
              </Box>
              <Switch
                checked={settings.showCalendar}
                onChange={(e) =>
                  setSettings({ ...settings, showCalendar: e.target.checked })
                }
              />
            </FormControl>
            <FormControl
              orientation="horizontal"
              sx={{ justifyContent: "space-between" }}
            >
              <Box>
                <FormLabel>
                  <Typography startDecorator={<FaListAlt />} level="inherit">
                    List View
                  </Typography>
                </FormLabel>
                <FormHelperText>Shows your deadlines in a list.</FormHelperText>
              </Box>
              <Switch
                checked={settings.showList}
                onChange={(e) =>
                  setSettings({ ...settings, showList: e.target.checked })
                }
              />
            </FormControl>
            <FormControl
              orientation="horizontal"
              sx={{ justifyContent: "space-between" }}
            >
              <Box>
                <FormLabel>
                  <Typography startDecorator={<FaMoon />} level="inherit">
                    Dark Mode
                  </Typography>
                </FormLabel>
                <FormHelperText>Color theme of the app.</FormHelperText>
              </Box>
              <DarkModeSwitch />
            </FormControl>
            <FormControl
              orientation="vertical"
              sx={{ justifyContent: "space-between" }}
            >
              <Box>
                <FormLabel>
                  <Typography startDecorator={<FaGlobe />} level="inherit">
                    Region
                  </Typography>
                </FormLabel>
                <FormHelperText>
                  Determines the format of dates and times, including Calendar
                  View.
                </FormHelperText>
              </Box>
              <Select
                value={settings.region}
                onChange={(e, value) =>
                  e && setSettings({ ...settings, region: value })
                }
                slotProps={{
                  listbox: {
                    placement: "bottom-start",
                  },
                }}
                sx={{ mt: 1 }}
              >
                <Option value="en-US">United States</Option>
                <Option value="en-GB">United Kingdom</Option>
                <Option value="sv-SE">Sweden</Option>
                <Option value="fi-FI">Finland</Option>
              </Select>
            </FormControl>
          </Stack>
        </ModalDialog>
      </Modal>
    </>
  );
}
