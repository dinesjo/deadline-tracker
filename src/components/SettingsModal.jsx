import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  List,
  ListItem,
  ListItemDecorator,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import {
  FaCalendarAlt,
  FaCalendarDay,
  FaCheckDouble,
  FaCog,
  FaEye,
  FaGlobe,
  FaGlobeAmericas,
  FaGlobeAsia,
  FaGlobeEurope,
  FaList,
  FaMoon,
} from "react-icons/fa";
import DarkModeSwitch from "./DarkModeSwitch";

export default function SettingsModal({ settings, setSettings }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton variant="plain" color="neutral" onClick={() => setOpen(true)}>
        <FaCog />
      </IconButton>
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
          <Stack
            spacing={2}
            sx={{
              overflowY: "auto",
            }}
          >
            <FormControl
              orientation="vertical"
              sx={{ justifyContent: "space-between" }}
            >
              <Box>
                <FormLabel>
                  <Typography startDecorator={<FaEye />} level="inherit">
                    View
                  </Typography>
                </FormLabel>
                <FormHelperText>
                  Choose between seeing a calendar, list, or both.
                </FormHelperText>
              </Box>
              <RadioGroup
                onChange={(e) => {
                  e.target.value &&
                    setSettings((settings) => ({
                      ...settings,
                      view: e.target.value,
                    }));
                }}
              >
                <List
                  sx={{
                    minWidth: 240,
                    "--List-gap": "0.5rem",
                    "--ListItem-paddingY": "1rem",
                    "--ListItem-radius": "8px",
                    "--ListItemDecorator-size": "32px",
                  }}
                >
                  {[
                    {
                      key: "calendar",
                      title: "Calendar only",
                      icon: <FaCalendarAlt />,
                    },
                    { key: "list", title: "List only", icon: <FaList /> },
                    {
                      key: "list calendar",
                      title: "Both (default)",
                      icon: <FaCheckDouble />,
                    },
                  ].map((item) => (
                    <ListItem
                      variant="outlined"
                      key={item.key}
                      sx={{ boxShadow: "sm" }}
                    >
                      <ListItemDecorator>{item.icon}</ListItemDecorator>
                      <Radio
                        size="sm"
                        overlay
                        value={item.key}
                        label={item.title}
                        checked={settings.view === item.key}
                        sx={{ flexGrow: 1, flexDirection: "row-reverse" }}
                        slotProps={{
                          action: ({ checked }) => ({
                            sx: (theme) => ({
                              ...(checked && {
                                inset: -1,
                                border: "2px solid",
                                borderColor: theme.vars.palette.primary[500],
                              }),
                            }),
                          }),
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </RadioGroup>
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
                <Option value="en-US">United States (default)</Option>
                <Option value="en-GB">United Kingdom</Option>
                <Option value="sv-SE">Sweden</Option>
                <Option value="fi-FI">Finland</Option>
              </Select>
            </FormControl>
            <FormControl
              orientation="vertical"
              sx={{ justifyContent: "space-between" }}
            >
              <Box>
                <FormLabel>
                  <Typography
                    startDecorator={<FaCalendarDay />}
                    level="inherit"
                  >
                    Start week on
                  </Typography>
                </FormLabel>
                <FormHelperText>
                  Which day of the week to start the calendar on.
                </FormHelperText>
              </Box>
              <RadioGroup
                onChange={(e) => {
                  e.target.value &&
                    setSettings((settings) => ({
                      ...settings,
                      calendarFirstDay: parseInt(e.target.value),
                    }));
                }}
              >
                <List
                  sx={{
                    minWidth: 240,
                    "--List-gap": "0.5rem",
                    "--ListItem-paddingY": "1rem",
                    "--ListItem-radius": "8px",
                    "--ListItemDecorator-size": "32px",
                  }}
                >
                  {[
                    {
                      key: 0,
                      title: "Sunday (default)",
                      icon: <FaGlobeAmericas />,
                    },
                    { key: 1, title: "Monday", icon: <FaGlobeEurope /> },
                    {
                      key: 6,
                      title: "Saturday",
                      icon: <FaGlobeAsia />,
                    },
                  ].map((item) => (
                    <ListItem
                      variant="outlined"
                      key={item.key}
                      sx={{ boxShadow: "sm" }}
                    >
                      {/* <ListItemDecorator>{item.icon}</ListItemDecorator> */}
                      <Radio
                        size="sm"
                        overlay
                        value={item.key}
                        label={item.title}
                        checked={settings.calendarFirstDay === item.key}
                        sx={{ flexGrow: 1, flexDirection: "row-reverse" }}
                        slotProps={{
                          action: ({ checked }) => ({
                            sx: (theme) => ({
                              ...(checked && {
                                inset: -1,
                                border: "2px solid",
                                borderColor: theme.vars.palette.primary[500],
                              }),
                            }),
                          }),
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </RadioGroup>
            </FormControl>
          </Stack>
        </ModalDialog>
      </Modal>
    </>
  );
}
