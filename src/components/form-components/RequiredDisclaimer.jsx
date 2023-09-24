import { AspectRatio, Typography } from "@mui/joy";

export default function RequiredDisclaimer() {
  return (
    <Typography
      level="body-xs"
      startDecorator={
        <AspectRatio
          ratio={1}
          sx={{
            borderRadius: "50%",
            width: "12px",
          }}
          color="primary"
          variant="solid"
        />
      }
    >
      required
    </Typography>
  );
}
