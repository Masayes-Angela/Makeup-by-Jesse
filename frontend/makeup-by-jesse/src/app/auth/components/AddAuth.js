// CRUD for Auth and User and for fetching data
"use client"

import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeactivateUserMutation,
  useReactivateUserMutation,
} from "@/rtk/authApi"
import { useState } from "react"

export default function AddAuth() {
  const { data: users, error, isLoading, refetch } = useGetUsersQuery()
  const [updateUser] = useUpdateUserMutation()
  const [deactivateUser] = useDeactivateUserMutation()
  const [reactivateUser] = useReactivateUserMutation()

  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({
    full_name: "",
    contact_number: "",
    role: "user",
    status: "ACTIVE",
  })

  const handleEdit = (user) => {
    setEditingUser(user.id)
    setEditForm({
      full_name: user.full_name,
      contact_number: user.contact_number,
      role: user.role,
      status: user.status,
    })
  }

  const handleUpdate = async (userId) => {
    try {
      await updateUser({ id: userId, ...editForm }).unwrap()
      setEditingUser(null)
      refetch()
    } catch (error) {
      console.error("Update failed:", error)
    }
  }

  const handleDeactivate = async (userId) => {
    try {
      await deactivateUser(userId).unwrap()
      refetch()
    } catch (error) {
      console.error("Deactivation failed:", error)
    }
  }

  const handleReactivate = async (userId) => {
    try {
      await reactivateUser(userId).unwrap()
      refetch()
    } catch (error) {
      console.error("Reactivation failed:", error)
    }
  }

  if (isLoading) return <div>Loading users...</div>
  if (error) return <div>Error loading users: {error.message}</div>

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Management</h2>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>ID</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Name</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Email</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Contact</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Role</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Status</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id}>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{user.id}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  {editingUser === user.id ? (
                    <input
                      type="text"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                      style={{ width: "100%", padding: "4px" }}
                    />
                  ) : (
                    user.full_name
                  )}
                </td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{user.email}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  {editingUser === user.id ? (
                    <input
                      type="text"
                      value={editForm.contact_number}
                      onChange={(e) => setEditForm({ ...editForm, contact_number: e.target.value })}
                      style={{ width: "100%", padding: "4px" }}
                    />
                  ) : (
                    user.contact_number
                  )}
                </td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  {editingUser === user.id ? (
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      style={{ width: "100%", padding: "4px" }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  <span
                    style={{
                      color: user.status === "ACTIVE" ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  {editingUser === user.id ? (
                    <div>
                      <button
                        onClick={() => handleUpdate(user.id)}
                        style={{
                          marginRight: "5px",
                          padding: "4px 8px",
                          backgroundColor: "#4ac7c5",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#ccc",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => handleEdit(user)}
                        style={{
                          marginRight: "5px",
                          padding: "4px 8px",
                          backgroundColor: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      {user.status === "ACTIVE" ? (
                        <button
                          onClick={() => handleDeactivate(user.id)}
                          style={{
                            padding: "4px 8px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivate(user.id)}
                          style={{
                            padding: "4px 8px",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Reactivate
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

