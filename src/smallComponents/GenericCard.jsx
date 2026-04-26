import { Box, Typography } from "@mui/material";

const GenericCard = ({ 
  value, 
  label, 
  icon: Icon, 
  iconColor = "#6D7280", 
  valueColor = "#393938",
  labelColor = "#737373",
  backgroundColor = "#fff",
  borderRadius = "12px",
  padding = "24px",
  boxShadow = "0px 2px 8px rgba(0, 0, 0, 0.1)",
  minHeight = "120px",
  display = "flex",
  flexDirection = "column",
  justifyContent = "space-between",
  position = "relative",
  overflow = "hidden"
}) => {
  return (
    <Box
      sx={{
        backgroundColor,
        borderRadius,
        padding,
        boxShadow,
        minHeight,
        display,
        flexDirection,
        justifyContent,
        position,
        overflow,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.15)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h4"
          sx={{
            color: valueColor,
            fontWeight: 500,
            fontSize: "2rem",
            lineHeight: 1.2,
            marginBottom: "4px",
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: labelColor,
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
      </Box>

      {/* Icon */}
      {Icon && (
        <Box
          sx={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            opacity: 0.8,
          }}
        >
          <Icon
            sx={{
              fontSize: "32px",
              color: iconColor,
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default GenericCard;
