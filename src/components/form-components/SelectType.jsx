import {
  ListItemDecorator,
  Option,
  Select,
} from "@mui/joy";
import types from "../../types";

export default function SelectType({ deadline, onChange }) {
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
      sx={{
        color: type?.color,
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
