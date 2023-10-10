import { Switch, useColorScheme } from "@mui/joy";
import { useEffect, useState } from "react";

export default function DarkModeSwitch() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  // necessary for server-side rendering
  // because mode is undefined on the server
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  return (
    <Switch
      checked={mode === "dark"}
      onChange={(e) => {
        setMode(e.target.checked ? "dark" : "light");
      }}
    />
  );
}