import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Button, ModalDialog, Typography } from "@mui/joy";
import { Modal } from "@mui/joy";
import DeadlineCard from "./components/DeadlineCard";
import { useState } from "react";

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
        setDeadlines={setDeadlines}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        eventInfo={eventInfo}
      />
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

/**
 * Modal to confirm moving a deadline
 * @param {function} setDeadlines - function to set deadlines
 * @param {Object} eventInfo - event info from FullCalendar
 * @param {boolean} modalOpen - state of modal
 * @param {function} setModalOpen - function to set modal state
 */
function ConfirmModal({ setDeadlines, eventInfo, modalOpen, setModalOpen }) {
  return (
    <Modal
      open={modalOpen}
      onClose={() => {
        setModalOpen(false);
      }}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <ModalDialog>
        <Typography level="h4">Are you sure?</Typography>
        <Typography level="body-md" sx={{ mt: 1 }}>
          Move <strong>{eventInfo?.event.extendedProps.deadline.title}</strong>{" "}
          to{" "}
          <strong>
            {eventInfo?.event.start?.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </strong>
          ?
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: ".5em",
            mt: 2,
          }}
        >
          <Button
            color="neutral"
            variant="outlined"
            onClick={() => {
              setModalOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            onClick={() => {
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
          >
            Confirm
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
