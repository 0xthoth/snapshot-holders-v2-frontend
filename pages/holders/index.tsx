import React, { useMemo, useState } from "react";
import {
  DataGrid,
  GridColDef,
  // GridValueGetterParams,
  GridToolbar,
} from "@mui/x-data-grid";
import styled from 'styled-components';
import { Box, Grid, Container } from "@mui/material";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
// import dayjs from "dayjs";
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useStake66HoldersInfo } from "hooks/holder";
import { numberFormat, currencyFormatter } from "helpers";


const columns: GridColDef[] = [
  { field: "address", headerName: "Address", width: 400 },
  { field: "balance", headerName: "Balance", valueFormatter: ({ value }) => numberFormat.format(Number(value)), width: 150, align: "right" },
  { field: "balanceToTEM", headerName: "Balance To TEM", valueFormatter: ({ value }) => numberFormat.format(Number(value)), width: 200, align: "right" },
  { field: "balanceTEMValue", headerName: "Balance TEM Value", valueFormatter: ({ value }) => currencyFormatter.format(Number(value)), width: 200, align: "right" },
  { field: "boost", headerName: "Boost", width: 80, align: "right" },
  { field: "stakedBlock", headerName: "Staked Block", width: 150, align: "right" },
  { field: "reward", headerName: "Reward", width: 150, valueFormatter: ({ value }) => numberFormat.format(Number(value)), align: "right" },
  // {
  //   field: "updatedAt",
  //   headerName: "Updated At",
  //   width: 200,
  //   valueGetter: (params: GridValueGetterParams) =>
  //     `${dayjs.unix(params.row.updatedAt)}`,
  // },
];

const TabStyle = styled(Tab)`
  && {
    font-weight: bold;
    font-size: 1.2rem;
  }
`;

const Holders = () => {
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const holders = useStake66HoldersInfo();

  const balances = useMemo((): {
    totalBalance: number,
    bscBalance: number,
    movrBalance: number,
    oneBalance: number
  } => {
    if (!holders[56] && !holders[1285]) return {
      totalBalance: 0,
      bscBalance: 0,
      movrBalance: 0,
      oneBalance: 0
    }

    const bscBalance = holders[56].reduce((preValue, curValue) => +preValue + +curValue.balance, 0);
    const movrBalance = holders[1285].reduce((preValue, curValue) => +preValue + +curValue.balance, 0);
    const oneBalance = holders[1666600000].reduce((preValue, curValue) => +preValue + +curValue.balance, 0);
    const totalBalance = bscBalance + movrBalance + oneBalance;

    return {
      bscBalance,
      movrBalance,
      totalBalance,
      oneBalance
    }
  }, [holders])

  const isLoading = !balances.totalBalance;

  return (
    <Container maxWidth="xl" sx={{
      py: 10
    }}>
      <Typography component="div" variant="h3" color="#7d0707" fontWeight="bold">
        Stake66 Holders.
      </Typography>
      <Grid container spacing={5} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Box>Total Balance</Box>
          <Typography component="div" variant="h3" color="#7d0707" fontWeight="bold">
            {!balances.totalBalance ? <Skeleton /> : numberFormat.format(Number(balances.totalBalance))}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box>BSC Balance</Box>
          <Typography component="div" variant="h3">
            {!balances.bscBalance ? <Skeleton /> : numberFormat.format(Number(balances.bscBalance))}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box>MOVR Balance</Box>
          <Typography component="div" variant="h3">
            {!balances.movrBalance ? <Skeleton /> : numberFormat.format(Number(balances.movrBalance))}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box>ONE Balance</Box>
          <Typography component="div" variant="h3">
            {!balances.oneBalance ? <Skeleton /> : numberFormat.format(Number(balances.oneBalance))}
          </Typography>
          <Alert severity="warning">Syncing — The data is not correct!</Alert>
        </Grid>
      </Grid>

      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>

          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <TabStyle label="BSC" value="1" />
            <TabStyle label="Moonriver" value="2" />
            <TabStyle label="Harmony" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <strong>{holders[56]?.length} holders.</strong>
          <div style={{ height: 1200, width: "100%" }}>
            <DataGrid
              loading={isLoading}
              rows={holders[56] ?? []}
              columns={columns}
              pageSize={100}
              rowsPerPageOptions={[100]}
              components={{ Toolbar: GridToolbar }}
            />
          </div>
        </TabPanel>
        <TabPanel value="2">
          <strong>{holders[1285]?.length} holders.</strong>
          <div style={{ height: 1200, width: "100%" }}>
            <DataGrid
              loading={isLoading}
              rows={holders[1285] ?? []}
              columns={columns}
              pageSize={100}
              rowsPerPageOptions={[100]}
              components={{ Toolbar: GridToolbar }}
            />
          </div>
        </TabPanel>
        <TabPanel value="3">
          <strong>{holders[1666600000]?.length} holders.</strong>
          <div style={{ height: 1200, width: "100%" }}>
            <DataGrid
              loading={isLoading}
              rows={holders[1666600000] ?? []}
              columns={columns}
              pageSize={100}
              rowsPerPageOptions={[100]}
              components={{ Toolbar: GridToolbar }}
            />
          </div>
        </TabPanel>
      </TabContext>

    </Container>
  );
};

export default Holders;
