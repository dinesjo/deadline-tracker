import { IconButton, ListItemDecorator, Option, Select } from "@mui/joy";
import types from "../../classes/types";
import { FaTimes } from "react-icons/fa";

export default function SelectType({ deadline, onChange, clearValue, width }) {
  const type = types.find((type) => type.name === deadline.type);

  return (
    <Select
      onChange={onChange}
      placeholder="Type"
      value={deadline.type}
      startDecorator={
        deadline.type && (
          // Icon for selected item
          <ListItemDecorator
            sx={{
              color: type?.color,
            }}
          >
            {type?.icon}
          </ListItemDecorator>
        )
      }
      {...(deadline.type && {
        // display the button and remove select indicator
        // when user has selected a value
        endDecorator: (
          <IconButton
            size="sm"
            variant="plain"
            color="neutral"
            onMouseDown={(event) => {
              // don't open the popup when clicking on this button
              event.stopPropagation();
            }}
            onClick={() => {
              clearValue();
            }}
          >
            <FaTimes />
          </IconButton>
        ),
        indicator: null,
      })}
      sx={{
        color: type?.color,
        width: width,
      }}
      slotProps={{
        listbox: {
          placement: "bottom-start",
        },
      }}
    >
      {types.map((type, index) => (
        <Option key={index} value={type.name} sx={{ color: type.color }}>
          <ListItemDecorator>{type.icon}</ListItemDecorator>
          {type.name}
        </Option>
      ))}
    </Select>
  );
}
