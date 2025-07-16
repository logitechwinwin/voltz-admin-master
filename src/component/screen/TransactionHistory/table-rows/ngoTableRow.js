import { Voltz } from "@/assets";
import Utils from "@/Utils";
import { Avatar, Box, Button, CircularProgress, Container, Grid, IconButton, Stack, TableCell, TableRow, Typography } from "@mui/material";
import { update } from "lodash";
import moment from "moment";
import Image from "next/image";

export const ngoTableRow = ({ data, role, type }) => {
    let { deal, event, user, sourceWallet, targetWallet, ...rest } = data;
    const isTransfer = data?.type === 'transfer';
    let updatedData = {
        id: event?.id,
        companyName: '',
        companyImage: '',
        ngoName: isTransfer ? sourceWallet?.user?.firstName + " " + sourceWallet?.user?.lastName : targetWallet?.user?.firstName + " " + targetWallet?.user?.lastName,
        ngoImage: isTransfer ? sourceWallet?.user?.profileImage : targetWallet?.user?.profileImage,
        volunteerName: isTransfer ? targetWallet?.user?.firstName + " " + targetWallet?.user?.lastName : '-',
        volunteerImage: isTransfer ? targetWallet?.user?.profileImage + " " + targetWallet?.user?.profileImage : '-',
        eventName: event?.title,
        eventImage: event?.bannerImage,
        campaignManager: '',
        type: data?.type,
        // dealImage: deal?.bannerImage || event?.bannerImage,
        // dealDescription: deal?.description,
        // dealAmount: deal?.dealAmount,
        // dealAmountAfterDiscount: deal?.dealAmountAfterDiscount,
        // dealStatus: deal?.status,
        // createdAt: deal?.createdAt
    }
    return (
        <TableRow>
            {role === 'admin' && <TableCell>
                <Stack direction="row" alignItems="center" gap={1}>
                    <Avatar variant="rounded" src={updatedData?.ngoImage} />
                    <Typography>{Utils.limitStringWithEllipsis(updatedData?.ngoName, 20)}</Typography>
                </Stack>
            </TableCell>}

            <TableCell sx={{ textAlign: 'center' }}>
                {isTransfer ?
                    <Stack direction="row" alignItems="center" gap={1}>
                        <>
                            <Avatar variant="rounded" src={updatedData?.volunteerImage} />
                            <Typography>{Utils.limitStringWithEllipsis(updatedData?.volunteerName, 20)}</Typography>
                        </>

                    </Stack> : '-'

                }
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
                {updatedData?.companyName ?
                    <Stack direction="row" alignItems="center" gap={1}>
                        <>
                            <Avatar variant="rounded" src={updatedData?.companyImage} />
                            <Typography>{Utils.limitStringWithEllipsis(updatedData?.companyName, 20)}</Typography>
                        </>

                    </Stack> : '-'

                }
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
                {isTransfer ?
                    <Stack direction="row" alignItems="center" gap={1}>
                        <>
                            <Avatar variant="rounded" src={updatedData?.eventImage} />
                            <Typography>{Utils.limitStringWithEllipsis(updatedData?.eventName, 20)}</Typography>
                        </>

                    </Stack> : '-'
                }
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
                {updatedData?.campaignManager ?
                    <Stack direction="row" alignItems="center" gap={1}>
                        <>
                            {/* <Avatar variant="rounded" src={updatedData?.companyImage} /> */}
                            <Typography>{Utils.limitStringWithEllipsis(updatedData?.campaignManager, 20)}</Typography>
                        </>
                    </Stack> : '-'
                }
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
        </TableRow>

    );
};
