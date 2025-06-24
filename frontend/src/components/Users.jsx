import { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    axios
      .get("http://localhost:3000/api/v1/user/bulk?filter=" + filter)
      .then((response) => {
        console.log("Fetched users:", response.data);

        const userList = Array.isArray(response.data.users)
          ? response.data.users
          : [];

        setUsers(userList);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please check the server.");
        setUsers([]);
        setLoading(false);
      });
  }, [filter]);

  return (
    <div className="mt-6">
      <div className="font-bold text-lg mb-2">Users</div>

      <input
        onChange={(e) => setFilter(e.target.value)}
        type="text"
        placeholder="Search users..."
        className="w-full px-2 py-1 border rounded border-slate-200 mb-4"
      />

      {loading && <p className="text-gray-500">Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && users.length === 0 && !error && (
        <p className="text-gray-500">No users found.</p>
      )}

      {users.map((user) => (
        <User key={user._id} user={user} />
      ))}
    </div>
  );
};

function User({ user }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between py-2 border-b">
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {user?.firstName?.[0] || "?"}
          </div>
        </div>
        <div className="flex flex-col justify-center h-full">
          <div>
            {user?.firstName} {user?.lastName}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center h-full">
        <Button
          onClick={() => {
            navigate(`/send?id=${user._id}&name=${user.firstName}`);
          }}
          label={"Send Money"}
        />
      </div>
    </div>
  );
}
