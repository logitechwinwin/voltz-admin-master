const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_TOKEN = process.env.NEXT_APP_TOKEN;

const SCREEN_TYPE = {
  NEW_MESSAGE: "new-message",
  NEW_MEMBER_JOIN_COMMUNITY: "new-member-join-community",
  NEW_EVENT_CREATED: "new-event-created",
  NEW_FOLLOWER: "new-follower",
  DEAL_REQUEST_STATUS: "deal-request-status",
  VOLTZ_REQUEST_STATUS: "voltz-request-status",
  NEW_DEAL_REQUEST: "new-deal-request",
};

const PROTECTED_ROUTES = [
  // "/ngo", "/company"
];

export { API_TOKEN, BASE_API_URL, BASE_URL, PROTECTED_ROUTES, SCREEN_TYPE };
