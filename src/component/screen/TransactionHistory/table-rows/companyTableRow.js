import { Voltz } from "@/assets";
import Utils from "@/Utils";
import { Avatar, Box, Button, CircularProgress, Container, Grid, IconButton, Stack, TableCell, TableRow, Typography } from "@mui/material";
import { update } from "lodash";
import moment from "moment";
import Image from "next/image";

export const companyTableRow = ({ data, role, type }) => {
    let { deal, event, user, sourceWallet, targetWallet, ...rest } = data;
    const isTransfer = data?.type === 'transfer';
    let updatedData = {
        id: event?.id,
        companyName: !isTransfer ? sourceWallet?.user?.firstName + " " + sourceWallet?.user?.lastName : targetWallet?.user?.firstName + " " + targetWallet?.user?.lastName,
        companyImage: !isTransfer ? sourceWallet?.user?.profileImage : targetWallet?.user?.profileImage,
        dealName: deal?.dealName,
        dealImage: deal?.bannerImage,
        ngoName: !isTransfer ? sourceWallet?.user?.firstName + " " + sourceWallet?.user?.lastName : '',
        ngoImage: !isTransfer ? sourceWallet?.user?.profileImage : '',
        volunteerName: isTransfer ? sourceWallet?.user?.firstName + " " + sourceWallet?.user?.lastName : '-',
        volunteerImage: isTransfer ? sourceWallet?.user?.profileImage + " " + sourceWallet?.user?.profileImage : '-',
        type: data?.type,
    }
    return (
        <TableRow>
            {role === 'admin' && <TableCell>
                <Stack direction="row" alignItems="center" gap={1}>
                    <Avatar variant="rounded" src={updatedData?.companyImage} />
                    <Typography>{Utils.limitStringWithEllipsis(updatedData?.companyName, 20)}</Typography>
                </Stack>
            </TableCell>}

            <TableCell sx={{ textAlign: 'center' }}>
                <Stack direction="row" alignItems="center" gap={1}>
                    <Avatar variant="rounded" src={updatedData?.volunteerImage} />
                    <Typography>{Utils.limitStringWithEllipsis(updatedData?.volunteerName, 20)}</Typography>
                </Stack>
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
                <Stack direction="row" alignItems="center" gap={1}>
                    <Avatar variant="rounded" src={updatedData?.dealImage} />
                    <Typography>{Utils.limitStringWithEllipsis(updatedData?.dealName, 20)}</Typography>
                </Stack>
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
                {updatedData?.ngoName ? <Stack direction="row" alignItems="center" gap={1}>
                    <Avatar variant="rounded" src={updatedData?.ngoImage} />
                    <Typography>{Utils.limitStringWithEllipsis(updatedData?.ngoName, 20)}</Typography>
                </Stack> : '-'}
            </TableCell>
            <TableCell>
                <Typography sx={{ textTransform: 'capitalize' }}>{updatedData?.type}</Typography>
            </TableCell>
            <TableCell>
                <Stack direction="row" gap={1}>
                    <Typography color="secondary.main" variant="h6" fontWeight="bold">
                        {data?.amount ?? 0}
                    </Typography>
                    <Image src={Voltz} alt="logo" priority />
                </Stack>
            </TableCell>
            <TableCell>{moment(data?.createdAt).format(process.env.NEXT_PUBLIC_DATE_FORMAT)}</TableCell>
            <TableCell>
                <Typography color={data?.status === "released" ? "success.main" : "error"} sx={{ textTransform: "capitalize" }}>
                    {data?.status}
                </Typography>
            </TableCell>
        </TableRow>

    );
};
