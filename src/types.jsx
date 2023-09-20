import {
  FaFilePdf,
  FaFlask,
  FaExclamationTriangle,
  FaComments,
  FaChalkboardTeacher,
} from "react-icons/fa";

const types = [
  {
    name: "Lab",
    color: "#3399FF",
    icon: <FaFlask />,
  },
  {
    name: "Hand-in",
    color: "#FFCC00",
    icon: <FaFilePdf />,
  },
  {
    name: "Seminar",
    color: "#00CC66",
    icon: <FaComments />,
  },
  {
    name: "Presentation",
    color: "#FF5577",
    icon: <FaChalkboardTeacher />,
  },
  {
    name: "Exam",
    color: "#FF5030",
    icon: <FaExclamationTriangle />,
  },
];

export default types;
