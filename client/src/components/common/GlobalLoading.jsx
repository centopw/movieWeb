import { useSelector } from "react-redux";
import { Paper, Box, CircularProgress, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { keyframes } from "@emotion/react";
import Logo from "./Logo";

const GlobalLoading = () => {
  const { globalLoading } = useSelector((state) => state.globalLoading);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (globalLoading) {
      setIsLoading(true);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [globalLoading]);

  const fadeInAnimation = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `;

  return (
    <>
      <Paper
        sx={{
          backgroundColor: "#1a1a1a",
          opacity: isLoading ? 1 : 0,
          pointerEvents: isLoading ? "auto" : "none",
          transition: "opacity 0.5s ease",
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Toolbar />
        <Box
          sx={{
            position: "relative",
            display: "inline-block",
            textAlign: "center",
            color: "#fff",
            animation: `${fadeInAnimation} 1s ease`,
          }}
        >
          <Logo size={80} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading...
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
            }}
          >
            <CircularProgress size={24} thickness={4} style={{ color: "#2ec4b6" }} />
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default GlobalLoading;
