export const transactionHistoryStatus = [
    { name: "All", value: "all" },
    { name: "Cancelled", value: "cancelled" },
    { name: "Released ", value: "released" },
    { name: "Hold ", value: "hold" },
];
export const transactionTypeData = {
    ngo: [
        { name: "All", value: "all" },
        { name: "Transfer", value: "transfer" },
        { name: "Purchase", value: "purchase" },
        { name: "Donate", value: "donate" },
    ],
    company: [
        { name: "All", value: "all" },
        { name: "Transfer", value: "transfer" },
        { name: "Donate", value: "donate" },
    ],
    volunteer: [
        { name: "All", value: "all" },
        { name: "Transfer", value: "transfer" },
    ]
};


// export const tableHeadings =["Name", "User", "Voltz", "Amount", "Amount after discount", "Created at", "Status"]
export const tableHeadings = (isAdmin, panel) => {
    let heading = []
    switch (panel) {
        case 'ngo':
            heading = ["Volunteer", "Company", "Event", "Campaign Manager", "Type", "Voltz", "Created at"]
            if (isAdmin) heading.unshift('NGO')
            break
        case 'company':
            heading = ["Volunteer", "Deal", "NGO", "Type", "Voltz", "Created at", "Status"]
            if (isAdmin) heading.unshift('Company')
            break
        case 'volunteer':
            heading = ["Volunteer", "Deal", "Campaign", "Type", "Voltz", "Created at", "Status"]
            break
        default:
            heading = []
            break
    }

    return heading
}