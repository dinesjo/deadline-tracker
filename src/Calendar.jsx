import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, ModalDialog } from "@mui/joy";
import { Modal } from "@mui/joy";
import DeadlineCard from "./components/DeadlineCard";
import { useState } from "react";
import ConfirmModal from "./components/ConfirmModal";

export default function Calendar({
  archived,
  setArchived,
  deadlines,
  setDeadlines,
  courses,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [eventInfo, setEventInfo] = useState(null);
  const events = [...archived, ...deadlines].map((deadline) => {
    const isArchived = archived.some((d) => d.id === deadline.id);
    const courseColor = courses.find(
      (course) => course.name === deadline.course
    ).color;
    return {
      id: deadline.id,
      date: new Date(deadline.date),
      allDay: true,
      classNames: ["bold", deadline.status.replace(" ", "-")],
      backgroundColor: isArchived ? "#555E6888" : courseColor,
      borderColor: isArchived ? "#555E6888" : courseColor,
      extendedProps: {
        deadline: deadline,
      },
    };
  });

  return (
    <Box>
      <ConfirmModal
        onConfirm={() => {
          setModalOpen(false);
          const deadline = eventInfo.event.extendedProps.deadline;
          setDeadlines((deadlines) => {
            const newDate = new Date(eventInfo.event.start);
            newDate.setDate(newDate.getDate() + 1); // HOTFIX
            deadline.date = newDate.toISOString().split("T")[0]; // format date to yyyy-MM-dd
            return deadlines.map((d) => {
              if (d.id === deadline.id) {
                return deadline;
              }
              return d;
            });
          });
        }}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      >
        Move <strong>{eventInfo?.event.extendedProps.deadline.title}</strong> to{" "}
        <strong>
          {eventInfo?.event.start?.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </strong>
        ?
      </ConfirmModal>
      <FullCalendar
        events={events}
        eventContent={eventContent}
        longPressDelay={500} // how long to wait before dragging on mobile (ms)
        plugins={[dayGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "today",
          center: "title",
          right: "prev,next",
        }}
        titleFormat={{ year: "numeric", month: "short" }}
        initialView="dayGridMonth"
        dayHeaderClassNames={["day-header"]}
        nowIndicatorClassNames={["now-indicator"]}
        firstDay={1} // start week on Monday
        weekNumbers={true}
        weekText="" // remove "W"-prefix
        weekNumberClassNames={["week-number"]}
        editable={true}
        eventDurationEditable={false}
        eventDrop={(eventInfo) => {
          setEventInfo(eventInfo);
          setModalOpen(true);
        }}
        height="auto"
      />
    </Box>
  );

  /**
   * Custom event content
   * @param {Object} eventInfo - event info from FullCalendar
   * @returns {JSX.Element} - JSX element to render
   * @see https://fullcalendar.io/docs/eventContent
   */
  function eventContent(eventInfo) {
    return (
      <EventContentJSX
        archived={archived}
        setArchived={setArchived}
        eventInfo={eventInfo}
        deadlines={deadlines}
        courses={courses}
        setDeadlines={setDeadlines}
      />
    );
  }
}

function EventContentJSX({ eventInfo, archived, setArchived, ...props }) {
  const { deadline } = eventInfo.event.extendedProps;
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalDialog sx={{ m: 0, p: 0 }}>
          <DeadlineCard
            sx={{ minWidth: "300px" }}
            deadline={deadline}
            archived={archived}
            setArchived={setArchived}
            {...props}
          />
        </ModalDialog>
      </Modal>
      <Box
        sx={{
          transition: "box-shadow .2s ease-out",
          overflow: "hidden",
          whiteSpace: "nowrap",
          px: ".1em",
          borderRadius: "5px",
          "&:hover": {
            boxShadow: "0 0 0 3px #eee",
          },
        }}
        onClick={() => setModalOpen(true)}
      >
        {deadline.title}
      </Box>
    </>
  );
}
