import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box } from "@mui/joy";
import { Tooltip } from "@mui/joy";
import DeadlineCard from "./components/DeadlineCard";

export default function Calendar({ deadlines, setDeadlines, courses }) {
  // console.log(deadlines);
  const events = deadlines.map((deadline) => {
    return {
      id: deadline.id,
      date: new Date(deadline.date),
      allDay: true,
      classNames: ["bold"],
      color: courses.find((course) => course.name === deadline.course).color,
      extendedProps: {
        deadline: deadline,
      },
    };
  });

  const eventContent = (eventInfo) => {
    const deadline = eventInfo.event.extendedProps.deadline;
    return (
      <Tooltip
        sx={{ m: 0, p: 0 }}
        title={
          <DeadlineCard
            deadline={deadline}
            deadlines={deadlines}
            courses={courses}
            sx={{ minWidth: "300px" }}
          />
        }
        placement="top"
        enterDelay={0}
        enterTouchDelay={0}
        leaveTouchDelay={3000}
      >
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {deadline.title}
        </Box>
      </Tooltip>
    );
  };

  return (
    <Box
    // sx={{
    //   backgroundColor: "background.body",
    //   color: "text.black",
    // }}
    >
      <FullCalendar
        events={events}
        eventContent={eventContent}
        longPressDelay={250} // how long to wait before dragging on mobile (ms)
        plugins={[dayGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "today",
          center: "title",
          right: "prev,next",
        }}
        titleFormat={{ year: "numeric", month: "short" }}
        initialView="dayGridMonth"
        dayHeaderClassNames={["day-header"]}
        firstDay={1} // start week on Monday
        weekNumbers={true}
        weekText="" // remove "W"-prefix
        weekNumberClassNames={["week-number"]}
        dayCellClassNames={["day-cell"]}
        editable={true}
        eventDurationEditable={false}
        eventDrop={(info) => {
          const deadline = deadlines.find(
            (deadline) => deadline.id === info.event.id
          );
          deadline.date = info.event.start;
          setDeadlines([...deadlines]);
        }}
        height="auto"
      />
    </Box>
  );
}
