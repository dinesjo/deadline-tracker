import React from "react";
import { FaFilePdf, FaFlask, FaExclamationTriangle } from "react-icons/fa";

const types = {
  color: { Lab: "primary", Assignment: "warning", Exam: "danger" },
  icon: {
    Lab: <FaFlask />,
    Assignment: <FaFilePdf />,
    Exam: <FaExclamationTriangle />,
  },
};

export default types;