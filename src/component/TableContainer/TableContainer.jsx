import React from 'react'
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    CircularProgress,
    Stack,
} from "@mui/material";
const UITable = ({
    headings=[],
    loading,
    spanTd =5,
    message,
    isContent,
    children,
    itemsPerPage,
    page,
    count,
    minWidth = "800px",
    handlePageChange,
    handleRowsPerPageChange,
    tableSyle={},
    ...props
}) => {
    return (
        <TableContainer
            sx={styles.container}>
            {/* Table Section */}
            <Box sx={{ flex: 1, overflowY: "auto", }}>
                <Table sx={{...tableSyle,minWidth}} {...props}>
                    <TableHead
                        sx={{
                            bgcolor: "primary.main",
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                        }}
                    >
                        <TableRow>
                            {headings?.map((item) => (
                                <TableCell sx={{ color: "white" }}>{item}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={spanTd} align="center">
                                    <CircularProgress size={22}/>
                                </TableCell>
                            </TableRow>
                        ) : isContent ? (
                            children
                        ) : (<TableRow>
                            <TableCell colSpan={spanTd} align="center">
                                <Typography sx={{ textAlign: "center" }} variant="caption1">
                                    {message ? message : "No Records Found"}
                                </Typography>
                            </TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </Box>

            {/* Pagination  */}
            <Stack sx={{mt:'auto'}}>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={count || 0}
                rowsPerPage={itemsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                />
                </Stack>
        </TableContainer>
    )
}

export default UITable

const styles = {
    container:{
        flex: 1,
        height:'100%',
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
    }
}