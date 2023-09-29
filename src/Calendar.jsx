import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Calendar({ deadlines, setDeadlines, courses }) {
  // console.log(deadlines);
  const events = deadlines.map((deadline) => {
    return {
      id: deadline.id,
      title: `${deadline.course} ${deadline.title}`,
      date: new Date(deadline.date),
      color: courses.find((course) => course.name === deadline.course).color,
      textColor: "black",
      allDay: true,
    };
  });

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        weekNumbers={true}
        weekText="" // remove "W"-prefix
        editable={true}
        eventDrop={(info) => {
          const deadline = deadlines.find(
            (deadline) => deadline.id === info.event.id
          );
          deadline.date = info.event.start;
          setDeadlines([...deadlines]);
        }}
        initialView="dayGridMonth"
        events={events}
        firstDay={1} // start week on Monday
      />
    </>
  );
}
