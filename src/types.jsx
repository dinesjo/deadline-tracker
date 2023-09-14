import React from "react";
import { FaFilePdf, FaFlask, FaExclamationTriangle, FaComments } from "react-icons/fa";

const types = [
  {
    name: "Lab",
    color: "#FF5733",
    icon: <FaFlask />,
  },
  {
    name: "Assignment",
    color: "#3399FF",
    icon: <FaFilePdf />,
  },
  {
    name: "Exam",
    color: "#FFCC00",
    icon: <FaExclamationTriangle />,
  },
  {
    name: "Seminar",
    color: "#00CC66",
    icon: <FaComments />,
  }
];

export default types;
