import * as React from "react";

import { FormHelperText } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import { IMaskInput } from "react-imask";

const TextMaskCustom = function TextMaskCustom(props) {
  const { onChange, textMask, ...other } = props;

  return (
    <IMaskInput
      {...other}
      mask={textMask}
      definitions={{
        "#": /[1-9]/,
      }}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
};

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

// const NumericFormatCustom = React.forwardRef(
//   function NumericFormatCustom(props, ref) {
//     const { onChange, ...other } = props;

//     return (
//       <NumericFormat
//         {...other}
//         getInputRef={ref}
//         onValueChange={(values) => {
//           onChange({
//             target: {
//               name: props.name,
//               value: values.value,
//             },
//           });
//         }}
//         thousandSeparator
//         valueIsNumericString
//         prefix="$"
//       />
//     );
//   },
// );

// NumericFormatCustom.propTypes = {
//   name: PropTypes.string.isRequired,
//   onChange: PropTypes.func.isRequired,
// };

const FormattedInputs = React.forwardRef(({ handleInput, name, value, textMask, error, label }, ref) => {
  //   const [values, setValues] = React.useState({
  //     textmask: "",
  //     numberformat: "1320",
  //   });

  //   const handleChange = (event) => {
  //     setValues({
  //       ...values,
  //       [event.target.name]: event.target.value,
  //     });
  //   };

  return (
    <Stack direction="column" spacing={2}>
      {/* <FormControl variant="outlined">
        <InputLabel htmlFor="formatted-text-mask-input">react-imask</InputLabel>
        <Input
          value={values.textmask}
          onChange={handleChange}
          name="textmask"
          id="formatted-text-mask-input"
          inputComponent={TextMaskCustom}
        />
      </FormControl> */}
      <FormControl error={error}>
        <TextField
          inputRef={ref}
          label={label}
          value={value}
          error={error}
          fullWidth
          onChange={handleInput}
          name={name}
          required
          id="formatted-text-mask-input"
          InputProps={{
            inputComponent: TextMaskCustom,
            inputProps: {
              textMask: textMask,
              ref: ref,
            },
          }}
          variant="outlined"
        />
        {error && <FormHelperText sx={{ mt: "0 !important" }}>{`${error}*`}</FormHelperText>}
      </FormControl>
    </Stack>
  );
});

FormattedInputs.displayName = FormattedInputs;

export default FormattedInputs;
