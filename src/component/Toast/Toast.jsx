import { Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { removeToast } from "@/store/reducer";

const Toast = () => {
  const { toast } = useSelector((state) => state.appReducer);
  const dispatch = useDispatch();

  return (
    <>
      {toast?.open && (
        <Snackbar
          open={toast?.open}
          autoHideDuration={3000}
          onClose={() => dispatch(removeToast())}
          onExited={() => dispatch(removeToast())}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert variant="filled" severity={toast?.type} onClose={() => dispatch(removeToast())}>
            {toast.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default Toast;
