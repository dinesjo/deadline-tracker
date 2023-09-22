import {
  Alert,
  Chip,
  Grid,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@mui/joy";
import DeadlineCard from "./components/DeadlineCard";

// const isMobile = window.innerWidth < 600;

export default function DeadlinesList({
  deadlines,
  setDeadlines,
  setArchived,
  courses,
}) {
  return (
    <Tabs defaultValue={-1}>
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
  return (
    <TabPanel value={index}>
      <Grid
        container
        spacing={4}
        columns={12}
        sx={{ justifyContent: "center" }}
      >
        {deadlines.length === 0 && (
          <Grid key={index} xs={12}>
            <NoDeadlinesAlert />
          </Grid>
        )}
        {deadlines
          .sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
          })
          .map((deadline) => (
            <Grid xs={12} sm={6} lg={4} key={deadline.id}>
              <DeadlineCard {...props} deadline={deadline} />
            </Grid>
          ))}
      </Grid>
    </TabPanel>
  );
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
