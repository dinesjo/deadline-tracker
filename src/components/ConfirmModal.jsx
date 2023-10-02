import { Box, Button, Modal, ModalDialog, Typography } from "@mui/joy";

/**
 * Confirmation modal
 * @param {function} onConfirm Function to run when user confirms
 * @param {boolean} modalOpen Whether modal is open
 * @param {function} setModalOpen Function to set modalOpen
 * @param {JSX.Element} children Modal content
 * @returns {JSX.Element} Modal
 */
export default function ConfirmModal({
  onConfirm,
  modalOpen,
  setModalOpen,
  children,
  confirmColor = "primary",
}) {
  return (
    <Modal
      open={modalOpen}
      onClose={() => {
        setModalOpen(false);
      }}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <ModalDialog>
        <Typography level="h4">Are you sure?</Typography>
        <Typography level="body-md" sx={{ mt: 1 }}>
          {children}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: ".5em",
            mt: 2,
          }}
        >
          <Button
            color="neutral"
            variant="outlined"
            onClick={() => {
              setModalOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="solid" color={confirmColor} onClick={onConfirm}>
            Confirm
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
