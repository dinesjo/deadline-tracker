import { Chip } from "@mui/joy";
import statuses from "../../classes/statuses";

/**
 * Displays status as a chip
 * @param {string} status "Not Started", "In Progress", or "Completed"
 * @param {string} id Deadline ID
 * @param {function} setDeadlines Function to set deadlines
 * @returns {JSX.Element} Chip
 */
export default function StatusChip({ status, id, setDeadlines }) {
  const nextStatus = {
    "Not Started": "In Progress",
    "In Progress": "Completed",
    Completed: "Not Started",
  }[status];

  return (
    <Chip
      variant="soft"
      size="sm"
      color={statuses.color[status]}
      startDecorator={statuses.icon[status]}
      onClick={() => {
        setDeadlines((current) => {
          return current.map((deadline) => {
            if (deadline.id === id) {
              return { ...deadline, status: nextStatus };
            }
            return deadline;
          });
        });
      }}
      sx={{
        py: 0.75,
        px: 1.5,
      }}
    >
      {status}
    </Chip>
  );
}
