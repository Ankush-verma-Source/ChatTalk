import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Group as GroupIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import moment from "moment";
import AdminLayout from "../../components/layout/AdminLayout.jsx";
import { DoughnutChart, LineChart } from "../../components/specific/Charts.jsx";
import {
  CurveButton,
  SearchField,
} from "../../components/styles/styledComponents.jsx";
import { matBlack } from "../../constants/color.js";

// import { useFetchData } from "6pp";
import { server } from "../../constants/config.js";
// import { LayoutLoader } from "../../components/layout/Loaders";
// import { useErrors } from "../../hooks/hook";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

2
function Dashboard() {
//   const { /*loading,*/ data, error } = useFetchData(
//     "http://localhost:3000/api/v1/admin/stats/",
//     "dashboard-stats",
//       {
//     credentials: "include",   // ensures cookie gets sent
//   }
//   );
//   console.log(`${server}/api/v1/admin/stats`);
//   console.log("Dashboard error:", error);
//   console.log("Dashboard data:", data);

  // const { stats } = data || {};

  // useErrors([{ isError: error, error: error }]);


const [stats , setStats] = useState({});

  const fetchStats = async () => {
  try {
    const res = await fetch(`${server}/api/v1/admin/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${token}` // add if needed
      },
      credentials: "include"
    });
    const data = await res.json();
    // console.log(data);
    let stats = data.stats || {};
    setStats(stats);
  } catch (err) {
    toast.error(err.message);
  }
};
useEffect(()=>{
  fetchStats();
},[]);

  const Appbar = (
    <Paper
      elevation={3}
      sx={{ padding: "2rem", margin: "2rem 0", borderRadius: "1rem" }}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
        <AdminPanelSettingsIcon sx={{ fontSize: "3rem" }} />
        <SearchField placeholder="Search..." />
        <CurveButton>Search</CurveButton>
        <Box flexGrow={1}></Box>
        <Typography
          display={{ xs: "none", sm: "block" }}
          color={"rgba(0,0,0,0.7)"}
          textAlign={"center"}
        >
          {moment().format("dddd, D MMMM YYYY")}
        </Typography>
        <NotificationsIcon />
      </Stack>
    </Paper>
  );

  // console.log(data);

  const Widgets = (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing="2rem"
      justifyContent="space-between"
      alignItems="center"
      margin={"2rem 0"}
    >
      <Widget title={"Users"} value={stats?.usersCount /*45*/} Icon={<PersonIcon />} />
      <Widget title={"Chats"} value={stats?.totalChatsCount /*78*/} Icon={<GroupIcon />} />
      <Widget
        title={"Messages"}
        value={stats?.messagesCount/*456*/}
        Icon={<MessageIcon />}
      />
    </Stack>
  );
  return (/*loading ? (
    <LayoutLoader />
  ) : (*/
    <AdminLayout>
      <Container component={"main"}>
        {Appbar}
        <Stack
          direction={{
            xs: "column",
            lg: "row",
          }}
          flexWrap={"wrap"}
          justifyContent={"center"}
          alignItems={{ xs: "center", lg: "stretch" }}
          sx={{ gap: "2rem" }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: "2rem 3.5rem",
              borderRadius: "1rem",
              width: "100%",
              maxWidth: "45rem",
            }}
          >
            <Typography margin={"2rem 0"} variant="h4">
              Last Messages
            </Typography>
            <LineChart value={stats?.messagesChart || []/*[23,12,3,14,54,4,6]*/} />
          </Paper>
          <Paper
            elevation={3}
            sx={{
              padding: "1rem",
              borderRadius: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: { xs: "100%", sm: "50%" },
              position: "relative",
              maxWidth: "25rem",
            }}
          >
            <DoughnutChart
              labels={["Single Chats", "Group Chats"]}
              value={[
                stats?.totalChatsCount - stats?.groupsCount || 0,
                stats?.groupsCount || 0,
              ]/*[23,12]*/}
            />
            <Stack
              position={"absolute"}
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={"0.5rem"}
              width={"100%"}
              height={"100%"}
            >
              <GroupIcon /> <Typography>Vs</Typography>
              <PersonIcon />
            </Stack>
          </Paper>
        </Stack>

        {Widgets}
      </Container>
    </AdminLayout>
  );
}

const Widget = ({ title, value, Icon }) => (
  <Paper
    elevation={3}
    sx={{
      padding: "2rem",
      margin: "2rem 0",
      borderRadius: "1.5rem",
      width: "20rem",
    }}
  >
    <Stack alignItems={"center"} spacing={"1rem"}>
      <Typography
        sx={{
          color: "rgba(0,0,0,0.7)",
          borderRadius: "50%",
          border: `5px solid ${matBlack}`,
          width: "5rem",
          height: "5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {value}
      </Typography>

      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        {Icon}
        <Typography>{title}</Typography>
      </Stack>
    </Stack>
  </Paper>
);

export default Dashboard;
