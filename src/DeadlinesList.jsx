import {
  Alert,
  Box,
  Chip,
  Divider,
  Grid,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@mui/joy";
import DeadlineCard from "./components/DeadlineCard";
import { Fragment } from "react";
import { FaCoffee } from "react-icons/fa";

// const isMobile = window.innerWidth < 600;

export default function DeadlinesList({
  deadlines,
  setDeadlines,
  setArchived,
  courses,
}) {
  return (
    <Tabs
      defaultValue={-1}
      sx={{
        backgroundColor: "background.body",
      }}
    >
      {/* Tab buttons and number indicator */}
      <TabList sx={{ overflowX: "auto" }}>
        <Tab
          value={-1}
          sx={{
            minWidth: "fit-content",
          }}
        >
          All{" "}
          <Chip variant="outlined" size="sm" color="neutral" sx={{ ml: 1 }}>
            {deadlines.length}
          </Chip>
        </Tab>
        {courses.map((course, index) => (
          <Tab
            value={index}
            sx={{
              color: course.color,
              minWidth: "fit-content",
            }}
            disabled={
              deadlines.filter((deadline) => deadline.course === course.name)
                .length === 0
            }
            key={index}
          >
            {course.name}
            <Chip variant="outlined" color="neutral" size="sm" sx={{ ml: 1 }}>
              {
                deadlines.filter((deadline) => deadline.course === course.name)
                  .length
              }
            </Chip>
          </Tab>
        ))}
      </TabList>
      {/* ALL-tab */}
      <TabPanelForCourse
        index={-1}
        deadlines={deadlines}
        setDeadlines={setDeadlines}
        setArchived={setArchived}
        courses={courses}
      />
      {/* Course[i]-tabs */}
      {courses
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((course, index) => (
          <TabPanelForCourse
            index={index}
            deadlines={deadlines.filter(
              (deadline) => deadline.course === course.name
            )}
            setDeadlines={setDeadlines}
            setArchived={setArchived}
            courses={courses}
            key={index}
          />
        ))}
    </Tabs>
  );
}

function TabPanelForCourse({ index, deadlines, ...props }) {
  const groupedDeadlines = groupDeadlinesByDate(deadlines);
  const dates = Object.keys(groupedDeadlines).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  return (
    <TabPanel value={index}>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ justifyContent: "center" }}
      >
        {deadlines.length === 0 && (
          <Grid key={index} xs={12}>
            <NoDeadlinesAlert />
          </Grid>
        )}
        {dates.map((date, index) => (
          <Fragment key={date}>
            {/* Date Divider */}
            <Divider
              sx={{ width: "100%", my: 2, transition: "all 0.3s ease-out" }}
            >
              {new Date(date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </Divider>

            {groupedDeadlines[date].map((deadline) => (
              <Grid xs={12} sm={6} lg={4} key={deadline.id}>
                <DeadlineCard {...props} deadlines={deadlines} deadline={deadline} />
              </Grid>
            ))}
            {index === dates.length - 1 ||
            new Date(dates[index + 1]).getTime() - new Date(date).getTime() <=
              86400000 * 3 ? (
              ""
            ) : (
              <Fragment key={index}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    width: "100%",
                    mt: 8,
                    mb: -2,
                  }}
                >
                  <Typography level="body-sm" startDecorator={<FaCoffee />}>
                    Some time later...
                  </Typography>
                </Box>
              </Fragment>
            )}
          </Fragment>
        ))}
      </Grid>
    </TabPanel>
  );

  // Helper function to group deadlines by date
  function groupDeadlinesByDate(deadlines) {
    return deadlines.reduce((groups, deadline) => {
      const date = deadline.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(deadline);
      return groups;
    }, {});
  }
}

function NoDeadlinesAlert() {
  return (
    <Alert
      variant="soft"
      color="neutral"
      sx={{ display: "flex", justifyContent: "center" }}
    >
      <Typography level="body-md">
        You have no deadlines. Add one from above.
      </Typography>
    </Alert>
  );
}
