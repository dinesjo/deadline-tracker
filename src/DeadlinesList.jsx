import {
  Alert,
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
import { daysFromNow } from "./app";

// const isMobile = window.innerWidth < 600;

export default function DeadlinesList({
  deadlines,
  setDeadlines,
  archived,
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
        archived={archived}
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
            archived={archived}
            setArchived={setArchived}
            courses={courses}
            key={index}
          />
        ))}
    </Tabs>
  );
}

function TabPanelForCourse({ index, deadlines, archived, ...props }) {
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
        {dates.map((date) => {
          // Format date
          let d;
          switch (daysFromNow(date)) {
            case -1:
              d = "Yesterday";
              break;
            case 0:
              d = "Today";
              break;
            case 1:
              d = "Tomorrow";
              break;
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
              d = new Date(date).toLocaleDateString("en-US", {
                weekday: "long",
              });
              break;
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
              d =
                "Next " +
                new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                });
              break;
            default:
              d = new Date(date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              });
              break;
          }
          return (
            <Fragment key={date}>
              {/* Date Divider */}
              <Divider
                sx={{ width: "100%", my: 2, transition: "all 0.3s ease-out" }}
              >
                {d}
              </Divider>

              {groupedDeadlines[date].map((deadline) => (
                <Grid xs={12} sm={6} lg={4} key={deadline.id}>
                  <DeadlineCard
                    {...props}
                    deadlines={deadlines}
                    deadline={deadline}
                    archived={archived}
                  />
                </Grid>
              ))}
            </Fragment>
          );
        })}
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
