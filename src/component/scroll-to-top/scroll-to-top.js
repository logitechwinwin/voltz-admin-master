"use client";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Fab, Zoom } from "@mui/material";
import { useEffect, useState } from "react";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Function to scroll to the top of the page
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Check scroll position
    const handleScroll = () => {
        const scrollPosition = window.scrollY; // Current scroll position
        const viewportHeight = window.innerHeight; // Height of the viewport (100vh)

        if (scrollPosition > viewportHeight) {
            setIsVisible(true); // Show button when scrolling beyond 100vh
        } else {
            setIsVisible(false); // Hide button if within the first 100vh
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <Zoom in={isVisible}>
            <Fab
                // color="primary"
                size="medium"
                onClick={scrollToTop}
                sx={{
                    position: "fixed",
                    bottom: 16,
                    right: 16,
                    zIndex: 1000,
                }}
            >
                <KeyboardArrowUpIcon />
            </Fab>
        </Zoom>
    );
};

export default ScrollToTop;
