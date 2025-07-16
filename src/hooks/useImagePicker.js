// "use client";

// import { useCallback, useState } from "react";

// import { useDropzone } from "react-dropzone";

// const useImagePicker = () => {
//   const [errors, setErrors] = useState();
//   const [selectedImage, setSelectedImage] = useState();

//   const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
//     if (rejectedFiles.length > 0) {
//       const errorMessage = rejectedFiles[0].errors[0].message;
//       setErrors(errorMessage);
//       setSelectedImage(null);
//       return;
//     }

//     const file = acceptedFiles[0];
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const imageDataUrl = e.target.result;
//       setSelectedImage({ file, imageDataUrl });
//       setErrors(null)
//     };
//     reader.readAsDataURL(file);
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     maxFiles: 1,
//     accept: {
//       "image/*": [".jpeg", ".png", ".svg", ".jpg"],
//     },
//     maxSize: 5 * 1024 * 1024,
//   });

//   return { getRootProps, getInputProps, isDragActive, errors, selectedImage };
// };

// export default useImagePicker;

"use client";

import { useCallback, useState } from "react";

import { useDropzone } from "react-dropzone";

import { PdfIcon } from "@/assets";

// const useImagePicker = ({ multiple = false, maxFiles = 1 ,type }) => {
//   const [errors, setErrors] = useState([]);
//   const [selectedImages, setSelectedImages] = useState([]);

// const onDrop = useCallback(
//   (acceptedFiles, rejectedFiles) => {
//     let newErrors = [];
//     let newSelectedImages = [];

//     if (rejectedFiles.length > 0) {
//       newErrors = rejectedFiles.map((file) => file.errors.map((error) => error.message)).flat();
//       setErrors(newErrors);
//       setSelectedImages([]);
//       return;
//     }

//     acceptedFiles.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         let imageDataUrl;
//         if(type=== 'pdf' && file.type === 'application/pdf'){
//            imageDataUrl = Pdf.src
//           }else{
//             imageDataUrl = e.target.result;
//           }
//         newSelectedImages.push({ file, imageDataUrl });
//         if (!multiple) {
//           setSelectedImages([{ file, imageDataUrl }]);
//         } else {
//           setSelectedImages((prevState) => [...prevState, { file, imageDataUrl }]);
//         }
//         setErrors([]);
//       };
//       reader.readAsDataURL(file);
//     });
//     setSelectedImages([]);
//   },
//   [multiple]
// );

const useImagePicker = (isPdf) => {
  const [errors, setErrors] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    let newErrors = [];
    if (rejectedFiles.length > 0) {
      newErrors = rejectedFiles.map((file) => file.errors.map((error) => error.message)).flat();
      setErrors(newErrors);
      return;
    }

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        let imageDataUrl;
        if (file.type === "application/pdf") {
          imageDataUrl = PdfIcon.src;
        } else {
          imageDataUrl = e.target.result;
        }
        const newImage = { file, imageDataUrl };

        setSelectedImages([newImage]); // Append new image if multiple is true
        // if (!multiple) {
        //   setSelectedImages([newImage]); // Replace images if multiple is false
        // } else {
        //   setSelectedImages(prevImages => [...prevImages, newImage]); // Append new image if multiple is true
        // }
      };
      reader.readAsDataURL(file);
    });

    // Clear errors when successful
    setErrors([]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,

    accept: isPdf
      ? {
          "image/*": [".jpeg", ".png", ".jpg"],
          "application/pdf": [".pdf"],
        }
      : { "image/*": [".jpeg", ".png", ".jpg"] },
    maxSize: 5 * 1024 * 1024,
  });

  return { getRootProps, getInputProps, isDragActive, errors, selectedImages, setSelectedImages };
};

export default useImagePicker;
