import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
// import { dashboardData } from "../../constants/sampleData";
import { Avatar, Box, Stack } from "@mui/material";
import moment from "moment";
import toast from "react-hot-toast";
import RenderAttachment from "../../components/shared/RenderAttachment";
import { server } from "../../constants/config";
import { fileFormat, transformImage } from "../../lib/features";
const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachements",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      const { attachements } = params.row;

      return attachements?.length > 0
        ? attachements.map((i) => {
            const url = i.url;
            const file = fileFormat(url);

            return (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <a
                  href={url}
                  download
                  target="_blank"
                  style={{ color: "black" }}
                >
                  {RenderAttachment(file, url)}
                </a>
              </Box>
            );
          })
        : "No attachments";
    },
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },
  {
    field: "sender",
    headerName: "Send By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
        <span>{params.row.sender.name}</span>
      </Stack>
    ),
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
  },
  {
    field: "groupChat",
    headerName: "Group chat",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
  },
];
function MessageManagement() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${server}/api/v1/admin/messages`, {
          method: "GET",
          // headers: {
          //   "Content-Type": "application/json",
          // },
          credentials: "include",
        });
        const data = await res.json();
        console.log(data);

        if (data.messages && data.messages.length > 0) {
          const transformedRows = data.messages.map((i) => ({
            ...i,
            id: i._id,
            sender: {
              name: i.sender.name,
              avatar: transformImage(i.sender.avatar, 50),
            },

            createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
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
  //     dashboardData.messages.map((i) => ({
  //       ...i,
  //       id: i._id,
  //       sender: {
  //         name: i.sender.name,
  //         avatar: transformImage(i.sender.avatar, 50),
  //       },

  //       createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
  //     }))
  //   );
  // }, []);
  return (
    <AdminLayout>
      <Table
        heading={"All Messages"}
        columns={columns}
        rows={rows}
        rowHeight={200}
      />
    </AdminLayout>
  );
}

export default MessageManagement;
