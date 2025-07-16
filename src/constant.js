import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import {
  ArrowOutwardOutlinedIcon,
  EventOutlinedIcon,
  GroupOutlinedIcon,
  GroupsOutlinedIcon,
  MessageOutlinedIcon,
  SpaceDashboardOutlinedIcon,
  DealsSvg,
  LocalOfferIcon,
  VolunteerActivismIcon,
  CampaignIcon,
  PersonIcon,
} from "@/assets";
import { History } from "@mui/icons-material";
import {
  AssignmentReturnedOutlinedIcon,
  CategoryIcon,
  Inventory2OutlinedIcon,
  LocalOfferOutlinedIcon,
  SupervisorAccountIcon,
  TopicIcon,
  NGOs,
} from "./assets";

let theme = createTheme({
  typography: {
    fontFamily: ["Inter", "Serif"].join(","),
    Regular: 400,
    Medium: 500,
    SemiBold: 600,
    Bold: 700,
    ExtraBold: 900,
    button: {
      textTransform: "none",
      fontWeight: "600",
    },
  },
  // shadows: [
  //   "none", // 0
  //   "0px 2.57px 2.57px 0px #00000033", // 1
  //   "0px 4px 8px rgba(0, 0, 0, 0.1)", // 2
  //   "0px 8px 16px rgba(0, 0, 0, 0.1)", // 3
  //   "0px 16px 32px rgba(0, 0, 0, 0.1)", // 4
  //   "0px 32px 64px rgba(0, 0, 0, 0.1)", // 5
  // ],
  palette: {
    primary: {
      main: "#00676D",
      // dark: "#3C3F43",
      neutralGrey: "#C6C6C6",
    },
    secondary: {
      main: "#06B0BA",
    },
    button: {
      dark: "rgba(77, 77, 77, 1)",
    },
    text: {
      hint: "#757575",
      hintV2: "#8f8f8f",
      primary: "#000000DE", // Primary text color
      secondary: "#0000008F", // Secondary text color
      disabled: "#7B7B80", // Disabled text color
      heading: "#3C3F43", // Heading text color
    },
    // success: {
    //   main: "#00B69B",
    // },
    // warning: {
    //   main: "#FCAF03",
    //   dark: "#d59913",
    // },
    // error: {
    //   main: "#FF0000",
    // },
  },
});
theme = responsiveFontSizes(theme);
export default theme;

export const GRID_SPACING = 4;
export const GRID_SUB_SPACING = 2;
export const DRAWER_WIDTH = 260;
export const HEADER_HEIGHT = "100px";
export const MOBILE_BREAK_POINT = "(min-width:900px)";
export const DRAWER_BREAK_POINT = "(min-width:2560px)";
export const TIME_OPTIONS = [
  { label: "2", value: 2 },
  { label: "4", value: 4 },
  { label: "6", value: 6 },
  { label: "8", value: 8 },
  { label: "10", value: 10 },
  { label: "12", value: 12 },
  { label: "14", value: 14 },
  { label: "16", value: 16 },
  { label: "18", value: 18 },
  { label: "20", value: 20 },
  { label: "22", value: 22 },
  { label: "24", value: 24 },
];

export const drawerRoutes = {
  ngo: [
    {
      path: "/ngo/dashboard",
      icon: <SpaceDashboardOutlinedIcon />,
      label: "Dashboard",
    },
    {
      path: "/ngo/campaigns",
      icon: <EventOutlinedIcon />,
      label: "Campaigns",
      children: [
        {
          path: "/ngo/campaigns/events",
          icon: <VolunteerActivismIcon />,
          label: "Events",
        },
        {
          path: "/ngo/campaigns/fundraising",
          icon: <CampaignIcon />,
          label: "Fundraising",
        },
      ],
    },
    {
      path: "/ngo/campaign-managers",
      icon: <SupervisorAccountIcon />,
      label: "Campaign Managers",
    },
    {
      path: "/ngo/volunteers-request",
      icon: <ArrowOutwardOutlinedIcon />,
      label: "Requests",
    },
    {
      path: "/ngo/community",
      icon: <GroupsOutlinedIcon />,
      label: "Community",
    },
    { path: "/ngo/chat", icon: <MessageOutlinedIcon />, label: "Messages" },
    {
      path: "/ngo/transaction-history",
      icon: <History />,
      label: "Transaction History",
    },
  ],
  campaign_manager: [
    {
      path: "/campaign-manager/campaign",
      icon: <EventOutlinedIcon />,
      label: "Campaign",
    },

    {
      path: "/campaign-manager/volunteers-request",
      icon: <ArrowOutwardOutlinedIcon />,
      label: "Requests",
    },
  ],
  admin: [
    {
      path: "/admin/dashboard",
      icon: <SpaceDashboardOutlinedIcon />,
      label: "Dashboard",
    },
    {
      path: "/admin/companies",
      icon: <EventOutlinedIcon />,
      label: "Companies",
    },
    { path: "/admin/ngos", icon: <GroupOutlinedIcon />, label: "NGOS" },
    {
      path: "/admin/volunteers",
      icon: <PersonIcon />,
      label: "Volunteers",
    },
    {
      path: "/admin/campaigns",
      icon: <EventOutlinedIcon />,
      label: "Campaigns",
      children: [
        {
          path: "/admin/campaigns/events",
          icon: <VolunteerActivismIcon />,
          label: "Events",
        },
        {
          path: "/admin/campaigns/fundraising",
          icon: <CampaignIcon />,
          label: "Fundraising",
        },
      ],
    },
    { path: "/admin/deals", icon: <LocalOfferIcon />, label: "Deals" },
    { path: "/admin/topics", icon: <TopicIcon />, label: "Topics" },
    { path: "/admin/categories", icon: <CategoryIcon />, label: "Categories" },
    {
      path: "/admin/life-stages",
      icon: <ArrowOutwardOutlinedIcon />,
      label: "Life Stages",
    },
    {
      icon: <History />,
      label: "Transaction",
      children: [
        {
          path: "/admin/company-transaction",
          icon: <EventOutlinedIcon />,
          label: "Company",
        },
        {
          path: "/admin/volunteer-transaction",
          icon: <PersonIcon />,
          label: "Volunteer",
        },
        {
          path: "/admin/ngo-transaction",
          icon: <GroupOutlinedIcon />,
          label: "NGO",
        },
      ],
    },
    {
      path: "/admin/kyc-verification",
      icon: <GroupsOutlinedIcon />,
      label: "KYC Verification",
    },
  ],
  company: [
    {
      path: "/company/dashboard",
      icon: <SpaceDashboardOutlinedIcon />,
      label: "Dashboard",
    },
    {
      path: "/company/advertisement",
      icon: <EventOutlinedIcon />,
      label: "Advertisement",
    },
    {
      path: "/company/deals",
      icon: <Inventory2OutlinedIcon />,
      label: "Deals",
    },
    {
      path: "/company/products",
      icon: <LocalOfferOutlinedIcon />,
      label: "Products",
    },
    {
      path: "/company/reports",
      icon: <ArrowOutwardOutlinedIcon />,
      label: "Reports",
    },
    {
      path: "/company/deals-requests",
      icon: <AssignmentReturnedOutlinedIcon />,
      label: "Deals Requests",
    },
    {
      path: "/company/transaction-history",
      icon: <History />,
      label: "Transaction History",
    },
  ],
};

export const inputRef = [
  "profileImage",
  "bannerImage",
  "name",
  "regNumber",
  "dateOfReg",
  "taxIdentificationNumber",
  "streetAddress",
  "country",
  "state",
  "city",
  "postalCode",
  "firstName",
  "lastName",
  "certificateOfReg",
  "csrPolicyDoc",
];

export const eventInputRefs = [
  "bannerImage",
  "title",
  "type",
  "startDate",
  "endDate",
  "campaignManagerId",
  "state",
  "address",
  "city",
  "country",
  "donationRequired",
  "volunteerRequired",
  "topics",
  "lifeStages",
  "voltzPerHour",
  "description",
  "sdgs",
  "facebookUrl",
  "twitterUrl",
  "radius",
  "linkedinUrl",
  "youtubeUrl",
];

export const ROLES = {
  NGO: "ngo",
  COMPANY: "company",
};

export const authRoutes = [
  "/login",
  "/ngo-kyc",
  "/company-kyc",
  "/reset-password",
  "/forgot-password",
  "/verify-otp",
];

export const handleNavigation = (data, role) => {
  let navigationPath;
  const parsedData = JSON.parse(data?.data || "{}");
  const notificationType = parsedData?.notificationType;
  switch (notificationType) {
    case "new-message":
      navigationPath = `/${role}/chat`;
      break;

    case "new-member-join-community":
      navigationPath = `/${role}/community`;
      break;

    case "new-event-created":
      navigationPath = `/${role}/events`;
      break;

    case "new-follower":
      navigationPath = `${process.env.NEXT_PUBLIC_WEB_URL}/volunteer?value=0&userId=61`;
      break;

    case "voltz-request-status":
      navigationPath = `/compaigns/${parsedData?.campaignId}`;
      break;

    case "new-volunteer-request":
      navigationPath = `/ngo/volunteers-request`;
      break;

    case "deal-request-status":
      navigationPath = `/deals/${parsedData?.dealId}`;
      break;
    case "new-deal-request":
      navigationPath = `/company/deals-requests`;
      break;
    case "voltz-purchased-by-ngo":
      navigationPath = `/${role}/ngo-transaction`;
      break;
    case "new-kyc-submitted":
      navigationPath = `/admin/kyc-verification`;
      break;
    case "foundational-voltz-purchased":
      navigationPath = ``;
      break;
  }

  return navigationPath || "#";
};
