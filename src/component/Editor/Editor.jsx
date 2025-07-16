import "react-quill/dist/quill.snow.css";
import { FormHelperText, InputLabel } from "@mui/material";
import dynamic from "next/dynamic";
// import { Quill } from "react-quill";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const Editor = ({ quillRef, value, onChange, error, name, labelTop }) => {
  //   let AlignStyle = Quill.import("attributors/style/align");
  //   let BackgroundStyle = Quill.import("attributors/style/background");
  //   let ColorStyle = Quill.import("attributors/style/color");
  //   let DirectionStyle = Quill.import("attributors/style/direction");
  //   const fontSizeArr = ["8px", "9px", "10px", "12px", "14px", "16px", "20px", "24px", "32px", "42px", "54px", "68px", "84px", "98px"];
  //   var Size = Quill.import("attributors/style/size");
  //   Size.whitelist = fontSizeArr;

  //   Quill.register(Size, true);
  //   Quill.register(AlignStyle, true);
  //   Quill.register(BackgroundStyle, true);
  //   Quill.register(ColorStyle, true);
  //   Quill.register(DirectionStyle, true);

  //   const modules = {
  //     toolbar: [
  //       ["bold", "italic", "underline", "strike", "blockquote"], // toggled buttons
  //       [{ list: "ordered" }, { list: "bullet" }],
  //       [{ size: [] }],
  //       [{ header: [1, 2, 3, 4, 5, 6, false] }],
  //       [{ align: [] }],
  //       ["clean"],
  //     ],
  //   };

  const modules = {
    toolbar: [
      // Dropdown for font family
      [{ font: [] }],
      // Dropdown for headings
      [{ header: "1" }, { header: "2" }, { header: [3, 4, 5, 6, false] }],
      // Text formatting options
      ["bold", "italic", "underline", "strike"],
      // Block quote and list options
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      // Indent and outdent
      [{ indent: "-1" }, { indent: "+1" }],
      // Blockquote and code block
      ["blockquote", "code-block"],
      // Insert link, image, and video
      ["link", "image", "video"],
      // Text color and background color
      [{ color: [] }, { background: [] }],
      // Clear formatting
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "align",
    "strike",
    "script",
    "blockquote",
    "background",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "code-block",
  ];

  return (
    <>
      {labelTop && (
        <InputLabel
          sx={{
            marginBottom: "10px !important",
            color: "#000",
          }}
        >
          {labelTop}
        </InputLabel>
      )}
      <ReactQuill
        ref={quillRef}
        onChange={(e) => {
          const data = {
            target: { value: e, name },
          };
          onChange(data);
        }}
        value={value || ""}
        modules={modules}
        formats={formats}
        bounds=".app"
        style={{ border: error && "1px solid red", margin: 0, padding: 0 }}
      />
      {error && <FormHelperText sx={{ color: "error.main", margin: "0 !important" }}>{error}</FormHelperText>}
    </>
  );
};

export default Editor;
// import React from "react";

// const Editor = () => {
//   return <></>;
// };

// export default Editor;
