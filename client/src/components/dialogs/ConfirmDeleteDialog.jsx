import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,Button } from "@mui/material"

function ConfirmDeleteDialog({open, handleClose, deleteHandler}) {
  return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Are you sure you want to delete this member?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>No</Button>
            <Button onClick={deleteHandler}>Yes</Button>
        </DialogActions>
    </Dialog>
  )
}

export default ConfirmDeleteDialog;