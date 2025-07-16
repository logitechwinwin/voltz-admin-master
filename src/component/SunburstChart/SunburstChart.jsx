import { ResponsiveSunburst } from "@nivo/sunburst";

const getColor = (id) => {
  if (id?.includes("Upcoming")) return "#F7B400";
  if (id?.includes("Ongoing")) return "#81c784";
  if (id?.includes("Expired")) return "#e57373";
  if (id?.includes("Donation Complete")) return "#67B0EA";
  return "#cccccc";
};

const LEGEND_ITEMS = [
  { label: "Upcoming", color: "#F7B400" },
  { label: "Ongoing", color: "#81c784" },
  { label: "Expired", color: "#e57373" },
  { label: "Donation Complete", color: "#67B0EA" },
];

const SunburstChart = ({ data, title }) => {
  return (
    data && (
      <div style={{ position: "relative", height: "400px" }}>
        <ResponsiveSunburst
          data={data}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          id="id"
          value="value"
          cornerRadius={6}
          borderWidth={2}
          borderColor="#ffffff"
          arcLabel="value"
          colors={(node) => getColor(node.id)}
          childColor={{
            from: "color",
            modifiers: [["brighter", 0.1]],
          }}
          enableArcLabels={true}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: "color",
            modifiers: [["darker", 1.4]],
          }}
          tooltip={(data) => (
            <div
              style={{
                padding: "10px",
                backgroundColor: "#fff",
                borderRadius: "5px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* Color box */}
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: data?.color,
                  marginRight: "10px",
                  borderRadius: "4px",
                }}
              ></div>
              {/* Tooltip content */}
              <div>
                <strong>{data?.id?.split(" ")?.pop()}</strong>
                <div>Value: {new Intl.NumberFormat().format(data?.value)}</div>
              </div>
            </div>
          )}
        />

        {/* Center Label and Value */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "#333",
          }}
        >
          <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>{title}</h1>
        </div>
      </div>
    )
  );
};

export default SunburstChart;
