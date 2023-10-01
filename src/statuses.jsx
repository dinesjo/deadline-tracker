import { FaCheckCircle, FaRegCircle, FaSpinner } from "react-icons/fa";

const statuses = {
  color: {
    "Not Started": "neutral",
    "In Progress": "primary",
    Completed: "success",
  },
  icon: {
    "Not Started": <FaRegCircle />,
    "In Progress": <FaSpinner />,
    Completed: <FaCheckCircle />,
  },
};

export default statuses;