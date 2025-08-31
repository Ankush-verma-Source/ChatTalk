import { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { Avatar, Stack } from "@mui/material";
import { useEffect } from "react";
// import { dashboardData } from "../../constants/sampleData";
import { transformImage } from "../../lib/features";
import AvatarCard from "../../components/shared/AvatarCard";
import { server } from "../../constants/config";
import toast from "react-hot-toast";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => <AvatarCard avatar={params.row.avatar} />,
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 300,
  },
  {
    field: "groupChat",
    headerName: "Group",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "totalMembers",
    headerName: "Total Members",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "members",
    headerName: "Members",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => (
      <AvatarCard max={100} avatar={params.row.members} />
    ),
  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "creator",
    headerName: "Created By ",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => (
      <Stack direction="row" alignItems="center" spacing={"1rem"}>
        <Avatar alt={params.row.creator.name} src={params.row.creator.avatar} />
        <span>{params.row.creator.name}</span>
      </Stack>
    ),
  },
];
function ChatManagement() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${server}/api/v1/admin/chats`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await res.json();
        // console.log(data);

        if (data.chats && data.chats.length > 0) {
          const transformedRows = data.chats.map((i) => ({
            ...i,
            id: i._id,
            avatar: i.avatar.map((i) => transformImage(i, 50)),
            members: i.members.map((i) => transformImage(i.avatar, 50)),
            creator: {
              name: i.creator.name,
              avatar: transformImage(i.creator.avatar, 50),
            },
          }));

          setRows(transformedRows);
        }
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchStats();
  }, []);

  // useEffect(() => {
  //   setRows(
  //     dashboardData.chats.map((i) => ({
  //       ...i,
  //       id: i._id,
  //       avatar: i.avatar.map((i) => transformImage(i, 50)),
  //       members: i.members.map((i) => transformImage(i.avatar, 50)),
  //       creator:{
  //         name:i.creator.name,
  //         avatar:transformImage(i.creator.avatar, 50)
  //       },
  //     }))
  //   );
  // }, []);
  return (
    <AdminLayout>
      <Table heading={"All Chats"} columns={columns} rows={rows} />
    </AdminLayout>
  );
}

export default ChatManagement;
