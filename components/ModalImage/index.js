import { Box, Modal, Button } from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";

//style modal
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
  textAlign: "center",
};

function ModalImage({ imageUrl }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <img
        src={imageUrl}
        alt="Thumbnail"
        style={{ width: "100px", cursor: "pointer", borderRadius: "10px" }}
        onClick={handleOpen}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img
            src={imageUrl}
            alt="Preview"
            style={{ width: "100%", borderRadius: "10px" }}
          />
          <Button
            variant="contained"
            color="primary"
            href={imageUrl}
            download
            sx={{ mt: 2 }}
          >
            Download Image
          </Button>
        </Box>
      </Modal>
    </>
  );
}

ModalImage.propTypes = {
  imageUrl: PropTypes.string.isRequired,
};

export default ModalImage;
