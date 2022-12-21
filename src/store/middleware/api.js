import axios from "axios";
import * as actions from "../api";
import { toast } from "react-toastify";

function setAuthToken(authtoken) {
  axios.defaults.headers.common["x-auth-token"] = authtoken;
}

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    toast.error("Internal server error");
  }

  return Promise.reject(error);
});

const api =
  ({ dispatch, getState }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegan.type) return next(action);

    setAuthToken(getState().auth.authToken);

    const { url, method, data, onStart, onSuccess, onError } = action.payload;

    if (onStart) dispatch({ type: onStart });

    next(action);

    try {
      const response = await axios.request({
        baseURL: process.env.REACT_APP_API_URL,
        url,
        method,
        data,
      });

      dispatch(
        actions.apiCallSuccess({
          data: response.data,
          header: response.headers["x-auth-token"],
        })
      );
      if (onSuccess)
        dispatch({
          type: onSuccess,
          payload: {
            data: response.data,
            header: response.headers["x-auth-token"],
          },
        });
    } catch (error) {
      if (!error.response) dispatch(actions.apiCallFailed());
      else
        dispatch(
          actions.apiCallFailed({
            message: error.response.data,
            status: error.response.status,
          })
        );

      if (!error.response) dispatch({ type: onError });
      else if (onError)
        dispatch({
          type: onError,
          payload: {
            message: error.response.data,
            status: error.response.status,
          },
        });
    }
  };

export default api;
