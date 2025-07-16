import { ApiManager } from "@/helpers";
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";
import { debounce } from "lodash";
import React, { forwardRef, useCallback, useEffect, useState } from "react";

const AutoComplete = forwardRef(
  (
    {
      label,
      multiple = false,
      name = "",
      url: path,
      value,
      options = [],
      error,
      onChange = () => {},
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const getData = async (search) => {
      if (!path) return;
      if (search) path += `&search=${search}`;
      setIsLoading(true);
      try {
        const { data } = await ApiManager({ path });
        console.log("🚀 ~ getData ~ res:", data?.response?.details);
        let filteredData = data?.response?.details;
        if (!Array.isArray(filteredData)) filteredData = filteredData?.items;
        setData(
          filteredData?.map((each) => ({
            id: each.id,
            name:
              each.name ||
              each?.title ||
              each?.dealName ||
              each?.label ||
              each?.firstName + " " + each?.lastName,
          }))
        );
      } catch (error) {
        console.log("🚀 ~ getData ~ error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debouncedGetData = debounce((searchValue) => {
      // Update the search state
      getData(searchValue); // Fetch data based on the search value
    }, 500);

    return (
      <FormControl fullWidth={true}>
        <Autocomplete
          multiple={multiple}
          options={path ? data : options}
          loading={isLoading}
          // error={formErrors?.campaignManagerId}
          value={value}
          onOpen={() => getData("")}
          onChange={onChange}
          getOptionLabel={(option) => option.name || option.label}
          renderOption={(props, option) => (
            <li
              {...props}
              style={{
                display: "flex",
                fontWeight: option.id === "all" ? "bold" : "normal",
                width: "100%",
              }}
            >
              {option.label || option.name}
            </li>
          )}
          // error={formErrors?.campaignManagerId}
          renderInput={(params) => (
            <TextField
              name={name}
              inputRef={ref}
              onChange={(e) => debouncedGetData(e.target.value)}
              error={!!error}
              helperText={error}
              {...params}
              label={label}
            />
          )}
          {...props}
        />
      </FormControl>
    );
  }
);

export default AutoComplete;
