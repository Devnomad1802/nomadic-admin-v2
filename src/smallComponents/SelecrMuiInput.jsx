/* eslint-disable react/prop-types */
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// eslint-disable-next-line react/prop-types
export default function SelectMuiInput({
  onCategoryChange,
  names,
  defaultValue,
  multiple = true,
}) {
  const [personName, setPersonName] = useState(
    multiple ? defaultValue || [] : defaultValue || ""
  );

  useEffect(() => {
    if (defaultValue) {
      setPersonName(defaultValue);
    }
  }, [defaultValue]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    if (multiple) {
      const selectedCategories =
        typeof value === "string" ? value.split(",") : value;
      setPersonName(selectedCategories);
      onCategoryChange(selectedCategories);
    } else {
      setPersonName(value);
      onCategoryChange(value);
    }
  };

  return (
    <div>
      <FormControl sx={{ width: 300 }}>
        <Select
          size="small"
          sx={{
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "#E7E7E7",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#E7E7E7",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#E7E7E7",
            },
            "& .MuiSelect-select": {
              color: "#000",
            },
            "& .MuiSvgIcon-root": {
              color: "#000",
            },
          }}
          multiple={multiple}
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" />}
          MenuProps={multiple ? MenuProps : undefined}
          renderValue={(selected) => {
            if (multiple) {
              // For multiselect, show selected items with cross icons
              if (!selected || selected.length === 0) {
                return (
                  <span style={{ color: "#737373" }}>Select options...</span>
                );
              }

              return (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => {
                    const selectedItem = names?.find((item) =>
                      typeof item === "string"
                        ? item === value
                        : item.id === value
                    );
                    const displayLabel =
                      typeof selectedItem === "string"
                        ? selectedItem
                        : selectedItem?.name || value;

                    return (
                      <Box
                        key={value}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          backgroundColor: "#f5f5f5",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          border: "1px solid #E7E7E7",
                          fontSize: "12px",
                          color: "#393938",
                        }}
                      >
                        <span>{displayLabel}</span>
                      </Box>
                    );
                  })}
                </Box>
              );
            } else {
              // For single select, show the selected value
              if (!selected) {
                return (
                  <span style={{ color: "#737373" }}>Select option...</span>
                );
              }

              const selectedItem = names?.find((item) =>
                typeof item === "string"
                  ? item === selected
                  : item.id === selected
              );

              const displayValue =
                typeof selectedItem === "string"
                  ? selectedItem
                  : selectedItem?.name || selected;

              return displayValue;
            }
          }}
        >
          {names?.map((item) => {
            // Handle both string names and object items
            const displayName = typeof item === "string" ? item : item.name;
            const itemValue = typeof item === "string" ? item : item.id;
            return (
              <MenuItem
                key={itemValue}
                value={itemValue}
                sx={{
                  color: "#000",
                  fontSize: "13px",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#E7E7E7",
                    "&:hover": {
                      backgroundColor: "#E7E7E7",
                    },
                  },
                }}
              >
                {displayName}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}
