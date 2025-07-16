const charityData = (charityCounts) => {
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
                value: charityCounts?.upcomingActiveArchived,
              },
              {
                name: "Not Archived",
                id: "Upcoming Active Not-Archived",
                value: charityCounts?.upcomingActiveNotArchived,
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
                value: charityCounts?.upcomingInactiveArchived,
              },
              {
                name: "Not Archived",
                id: "Upcoming Inactive Not-Archived",
                value: charityCounts?.upcomingInactiveNotArchived,
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
                value: charityCounts?.ongoingActiveArchived,
              },
              {
                name: "Not Archived",
                id: "Ongoing Active Not-Archived",
                value: charityCounts?.ongoingActiveNotArchived,
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
                value: charityCounts?.ongoingInactiveArchived,
              },
              {
                name: "Not Archived",
                id: "Ongoing Inactive Not-Archived",
                value: charityCounts?.ongoingInactiveNotArchived,
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
                value: charityCounts?.expiredActiveArchived,
              },
              {
                name: "Not Archived",
                id: "Expired Active Not-Archived",
                value: charityCounts?.expiredActiveNotArchived,
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
                value: charityCounts?.expiredInactiveArchived,
              },
              {
                name: "Not Archived",
                id: "Expired Inactive Not-Archived",
                value: charityCounts?.expiredInactiveNotArchived,
              },
            ],
          },
        ],
      },
      {
        id: "Donation Complete",
        name: "Donation Complete",
        children: [
          {
            name: "Active",
            id: "Donation Complete Active",
            children: [
              {
                name: "Archived",
                id: "Donation Complete Active Archived",
                value: charityCounts?.donationCompleteActiveArchived,
              },
              {
                name: "Not Archived",
                id: "Donation Complete Active Not-Archived",
                value: charityCounts?.donationCompleteActiveNotArchived,
              },
            ],
          },
          {
            name: "Inactive",
            id: "Donation Complete Inactive",
            children: [
              {
                name: "Archived",
                id: "Donation Complete Inactive Archived",
                value: charityCounts?.donationCompleteInactiveArchived,
              },
              {
                name: "Not Archived",
                id: "Donation Complete Inactive Not-Archived",
                value: charityCounts?.donationCompleteInactiveNotArchived,
              },
            ],
          },
        ],
      },
    ],
  };
};

export default charityData;
