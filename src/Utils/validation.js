const validate = (data, rules) => {
  const errors = {};
  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    if (rule.required && !data[field]) {
      errors[field] = "This field is required";
    } else if (rule.email && !/\S+@\S+\.\S+/.test(data[field])) {
      errors[field] = "Invalid email";
    } else if (rule.minLength && data[field].length < rule.minLength) {
      errors[field] = `Must be at least ${rule.minLength} characters`;
    }
  });
  return errors;
};

export default validate;

// const [data, setData] = useState({
//     name: '',
//     email: '',
//     password: '',
//   });
//   const [errors, setErrors] = useState({});

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const rules = {
//       name: { required: true },
//       email: { required: true, email: true },
//       password: { required: true, minLength: 8 },
//     };
//     const errors = validate(data, rules);
//     setErrors(errors);
//     if (!Object.keys(errors).length) {
//       // Form is valid, submit data
//     }
//   };
