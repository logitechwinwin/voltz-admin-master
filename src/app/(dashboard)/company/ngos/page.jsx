/* eslint-disable no-unused-vars */
"use client";

import React, { useCallback, useEffect, useState } from "react";

import { Add } from "@mui/icons-material";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { debounce } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import { NoRecord, NoRecordFound } from "@/assets";
import {
    AutoComplete,
    DeleteDialogBox,
    EventCard,
    InputField,
    NgoCard,
    NotFoundData,
    PrimaryButton,
    SearchBox,
    SecondaryButton,
    SelectBox,
    UsePagination,
} from "@/component";
import { ApiManager } from "@/helpers";
import { handleLoader, setToast } from "@/store/reducer";
import NGO from "@/component/NGO/NGO";

const NGOs = ({ role }) => {
    const params = new URLSearchParams(window.location.search);
    const initialPage = params.get("page") || 1;

    const [ngoData, setNgoData] = useState([]);
    const [page, setPage] = useState(+initialPage);
    const [loading, setLoading] = useState(true);
    const [sdgs, setSdgs] = useState([])
    const [selectedSdgs, setSelectedSdgs] = useState([])
    const { user } = useSelector((state) => state.appReducer);
    const dispatch = useDispatch();

    const getAllNgos = async (value = "") => {
        const selectedSdgsQuery = selectedSdgs?.map((sdg, i) => {
            return `sdgs[${i}]=${sdg.id}`
        }).join("&")
        setLoading(true);
        let path = `ngo?page=${page}&perPage=12&search=${value}`;
        if (selectedSdgs?.length) {
            path += `&${selectedSdgsQuery}`;
        }
        try {
            let { data } = await ApiManager({
                method: "get",
                path,
            });
            setNgoData(data?.response?.details);
        } catch (error) {
            dispatch(setToast({ type: "error", message: error?.message }));
        } finally {
            setLoading(false);
        }
    };
    const fetchSdgs = async () => {
        setLoading(true);
        try {
            const { data } = await ApiManager({
                method: "get",
                path: `sdgs?page=1&perPage=999`,
            });
            setSdgs(data?.response?.details);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const searchDebounce = useCallback(
        debounce((search) => getAllNgos(search), 500),
        [page]
    );


    // Function to update the URL query parameters
    const addQueryParam = (key, value) => {
        params.set(key, value);
        const newSearch = params.toString();
        const newUrl = `${window.location.pathname}?${newSearch}`;
        window.history.pushState({}, "", newUrl);
    };

    // Handle changes in pagination
    const handlePagination = (e, v) => {
        setPage(v);
        addQueryParam("page", v);
    };

    useEffect(() => {
        addQueryParam("page", page);
        if (user?.id) {
            getAllNgos();
        }
    }, [page, selectedSdgs]);

    useEffect(() => {
        fetchSdgs();
    }, [])

    return (
        <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            <Stack direction={{ xs: 'column', sm: "row" }} justifyContent="space-between" gap={2}>
                <Typography variant="h4" fontWeight={"bold"}>
                    NGOs
                </Typography>
                <Box width={{ xs: '100%', sm: '40%', md: '30%', lg: '20%' }}>
                    <AutoComplete
                        multiple
                        label="Select SDGs"
                        placeholder="Choose..."
                        options={sdgs}
                        onChange={(e, v) => setSelectedSdgs(v)}
                        value={selectedSdgs}
                        disableCloseOnSelect
                        limitTags={2}
                        getOptionLabel={(option) => option.label}
                    />
                </Box>
            </Stack>
            <Grid container spacing={2} my={2} justifyContent={"flex-end"}>
                <Grid item xs={12}>
                    <SearchBox setSearch={(value) => searchDebounce(value)} />
                </Grid>
            </Grid>
            <Box mt={"20px"}>
                <Grid container spacing={2}>

                    {loading ? (
                        Array(8)
                            .fill()
                            .map((_, i) => (
                                <Grid item key={i} lg={3} md={4} sm={6} xs={12}>
                                    <NGO loading />
                                </Grid>
                            ))
                    ) : ngoData?.items?.length ? (
                        ngoData?.items?.map((ngo, index) => (
                            <Grid item key={index} lg={3} md={4} sm={6} xs={12}>
                                <NGO
                                    data={ngo}
                                />
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Stack alignItems="center" justifyContent="center">
                                <Image src={NoRecordFound} alt="" priority />
                                <Typography>No NGOs Found</Typography>
                            </Stack>
                        </Grid>
                    )}
                </Grid>
            </Box>
            {ngoData?.meta?.totalPages > 1 && (
                <Stack
                    sx={{ mt: 'auto', mb: 5, background: 'grey' }}
                    justifyContent="flex-end"
                    alignItems="center"
                >
                    <UsePagination
                        total={ngoData?.meta?.totalItems}
                        page={page}
                        perPage={16}
                        onChangePage={handlePagination}
                    />
                </Stack>
            )}
        </Box>
    );
};

export default NGOs;
