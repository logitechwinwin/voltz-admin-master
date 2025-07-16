const campaignData = (campaignCounts) => {
  return {
    name: "Charities",
    children: [
      {
        id: "Upcoming",
        name: "Upcoming",
        children: [
          {
            name: "Active",
            id: "Upcoming Active",
            children: [
              {
                name: "Archived",
                id: "Upcoming Active Archived",
                value: campaignCounts?.upcomingActiveArchived,
              },
              {
                name: "Not Archived",
                id: "Upcoming Active Not-Archived",
                value: campaignCounts?.upcomingActiveNotArchived,
              },
            ],
          },
          {
            name: "Inactive",
            id: "Upcoming Inactive",
            children: [
              {
                name: "Archived",
                id: "Upcoming Inactive Archived",
                value: campaignCounts?.upcomingInactiveArchived,
              },
              {
                name: "Not Archived",
                id: "Upcoming Inactive Not-Archived",
                value: campaignCounts?.upcomingInactiveNotArchived,
              },
            ],
          },
        ],
      },
      {
        id: "Ongoing",
        name: "Ongoing",
        children: [
          {
            name: "Active",
            id: "Ongoing Active",
            children: [
              {
                name: "Archived",
                id: "Ongoing Active Archived",
                value: campaignCounts?.ongoingActiveArchived,
              },
              {
                name: "Not Archived",
                id: "Ongoing Active Not-Archived",
                value: campaignCounts?.ongoingActiveNotArchived,
              },
            ],
          },
          {
            name: "Inactive",
            id: "Ongoing Inactive",
            children: [
              {
                name: "Archived",
                id: "Ongoing Inactive Archived",
                value: campaignCounts?.ongoingInactiveArchived,
              },
              {
                name: "Not Archived",
                id: "Ongoing Inactive Not-Archived",
                value: campaignCounts?.ongoingInactiveNotArchived,
              },
            ],
          },
        ],
      },
      {
        id: "Expired",
        name: "Expired",
        children: [
          {
            name: "Active",
            id: "Expired Active",
            children: [
              {
                name: "Archived",
                id: "Expired Active Archived",
                value: campaignCounts?.expiredActiveArchived,
              },
              {
                name: "Not Archived",
                id: "Expired Active Not-Archived",
                value: campaignCounts?.expiredActiveNotArchived,
              },
            ],
          },
          {
            name: "Inactive",
            id: "Expired Inactive",
            children: [
              {
                name: "Archived",
                id: "Expired Inactive Archived",
                value: campaignCounts?.expiredInactiveArchived,
              },
              {
                name: "Not Archived",
                id: "Expired Inactive Not-Archived",
                value: campaignCounts?.expiredInactiveNotArchived,
              },
            ],
          },
        ],
      },
    ],
  };
};

export default campaignData;
