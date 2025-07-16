/* eslint-disable no-unused-vars */
import axios from "axios";

export default function ApiManager({
  header = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": true,
  },
  method = "get",
  path = "",
  params = {},
  baseUrl = process.env.NEXT_PUBLIC_API_URL,
  token = localStorage.getItem(process.env.NEXT_PUBLIC_APP_TOKEN),
  responseType = "json"
}) {
  let HEADER = { headers: header };
  if (token) {
    HEADER = { headers: { Authorization: `Bearer ${token}`, ...header } };
  }
  return new Promise(function (myResolve, myReject) {
    const config = {
      ...HEADER,
      responseType,
    };

    if (["put", "patch", "post"].indexOf(method) !== -1) {
      axios[method](baseUrl + path, params, config)
        .then((response) => {
          myResolve(response);
        })
        .catch((err) => {
          myReject(err);
        });
      return;
    }
    axios[method](baseUrl + path, config)
      .then((response) => {
        myResolve(response);
      })
      .catch((err) => {
        myReject(err);
      });
  });
}
