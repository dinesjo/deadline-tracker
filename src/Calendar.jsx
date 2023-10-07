import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, ModalDialog } from "@mui/joy";
import { Modal } from "@mui/joy";
import DeadlineCard from "./components/DeadlineCard";
import { useState } from "react";
import ConfirmModal from "./components/ConfirmModal";
import NewDeadlineForm from "./NewDeadlineForm";
import Deadline from "./deadline";

export default function Calendar({
  archived,
  setArchived,
  deadlines,
  setDeadlines,
  courses,
  settings,
}) {
  const [confirmMoveOpen, setConfirmMoveOpen] = useState(false);
  const [newDeadlineOpen, setNewDeadlineOpen] = useState(false);
  const [newDeadline, setNewDeadline] = useState(new Deadline({}));
  const [confirmMoveEventInfo, setConfirmMoveEventInfo] = useState(null);
  // const [newDeadlineEventInfo, setNewDeadlineEventInfo] = useState(null);
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
      // backgroundColor: isArchived ? "#555E6888" : courseColor,
      backgroundColor: "#222",
      borderColor: isArchived ? "#555E6888" : courseColor,
      textColor: "#eee",
      extendedProps: {
        deadline: deadline,
      },
    };
  });

  return (
    <Box>
      <ConfirmModal
        onConfirm={() => {
          setConfirmMoveOpen(false);
          const deadline = confirmMoveEventInfo.event.extendedProps.deadline;
          setDeadlines((deadlines) => {
            const newDate = new Date(confirmMoveEventInfo.event.start);
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
        modalOpen={confirmMoveOpen}
        setModalOpen={setConfirmMoveOpen}
      >
        Move{" "}
        <strong>
          {confirmMoveEventInfo?.event.extendedProps.deadline.title}
        </strong>{" "}
        to{" "}
        <strong>
          {confirmMoveEventInfo?.event.start?.toLocaleDateString(settings.region, {
            month: "long",
            day: "numeric",
          })}
        </strong>
        ?
      </ConfirmModal>
      {/* NEW DEADLINE MODAL */}
      <Modal open={newDeadlineOpen} onClose={() => setNewDeadlineOpen(false)}>
        <ModalDialog>
          <NewDeadlineForm
            setDeadlines={setDeadlines}
            courses={courses}
            newDeadline={newDeadline}
            setNewDeadline={setNewDeadline}
            setOpen={setNewDeadlineOpen}
          />
        </ModalDialog>
      </Modal>
      <FullCalendar
        locale={settings.region}
        events={events}
        dateClick={(eventInfo) => {
          setNewDeadline(new Deadline({ date: eventInfo.dateStr }));
          setNewDeadlineOpen(true);
        }}
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
        dayCellClassNames={["day-cell"]}
        firstDay={1} // start week on Monday
        weekNumbers={true}
        weekText="" // remove "W"-prefix
        weekNumberClassNames={["week-number"]}
        editable={true}
        eventDurationEditable={false}
        eventDrop={(eventInfo) => {
          setConfirmMoveEventInfo(eventInfo);
          setConfirmMoveOpen(true);
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
        settings={settings}
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
          overflow: "hidden",
          whiteSpace: "nowrap",
          borderRadius: "0 0px 4px 4px",
          px: ".1em",
          "&:hover": {
            cursor: "pointer",
            backgroundColor: "#444",
          },
        }}
        onClick={() => setModalOpen(true)}
      >
        {deadline.title}
      </Box>
    </>
  );
}
