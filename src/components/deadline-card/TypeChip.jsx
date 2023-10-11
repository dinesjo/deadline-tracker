import { Chip } from "@mui/joy";
import types from "../../classes/types";

/**
 * Displays assignment type as a chip
 * @param {string} type Assignment type name
 * @returns {JSX.Element} Chip
 */
export default function TypeChip({ type }) {
  return (
    <Chip
      variant="outlined"
      sx={{
        color: types.find((t) => t.name === type).color,
      }}
      startDecorator={types.find((t) => t.name === type).icon}
    >
      {type}
    </Chip>
  );
}
