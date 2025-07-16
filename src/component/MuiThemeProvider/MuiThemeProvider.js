'use client'

import { ThemeProvider } from "@mui/material";

import theme from "@/constant";




const MuiThemeProvider = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
}

export default MuiThemeProvider;