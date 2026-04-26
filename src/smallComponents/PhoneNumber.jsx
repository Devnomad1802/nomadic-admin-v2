/* eslint-disable react/prop-types */
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useState } from "react";
import { Box } from "@mui/material";
import "./phoneStyle.css";

const PhoneNumber = ({ handleChange, setRegisterData, registerData }) => {
  const [value, setValue] = useState();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <PhoneInput
        country={"in"}
        value={registerData?.phone} // Pass only the phone property
        onChange={(phone) => {
          setRegisterData({ ...registerData, phone }); // Update the phone property in registerData
          setValue(phone); // Optionally update local state if needed
        }}
        inputProps={{
          required: true,
        }}
      />
    </Box>
  );
};

export default PhoneNumber;
