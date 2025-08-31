import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { server } from "../../constants/config";
import { transformImage } from "../../lib/features";
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
    renderCell: (params) => (
      <Avatar alt={params.row.name} src={params.row.avatar} />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 200,
  },
];
function UserManagement() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${server}/api/v1/admin/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await res.json();
        // console.log(data);

        if (data.users && data.users.length > 0) {
          const transformedRows = data.users.map((user) => ({
            ...user,
            id: user._id,
            avatar: transformImage(user.avatar, 50),
          }));

          setRows(transformedRows);
        }
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      {}
      <Table heading={"All Users"} columns={columns} rows={rows} />
    </AdminLayout>
  );
}

export default UserManagement;
