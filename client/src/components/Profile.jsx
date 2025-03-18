import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { Modal } from "./Modal";
import { useAuth } from "./AuthProvider";
import { logOut } from "../api/auth";
import "../styles/Profile.css";

export const Profile = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [synonym, setSynonym] = useState("");
  const { user, updateUser } = useAuth();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
    }

    if (user?.fullName) {
      setSynonym(
        user.fullName
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase())
          .join("")
      );
    }
  }, [user]);

  const handleEdit = () => {
    if (editMode) {
      const updatedUser = {
        ...user,
        username,
        fullName,
        email,
      };

      // Call your API to update user info
      updateUser(updatedUser);
      setEditMode(false);
    } else {
      setEditMode(true);
    }
  };

  const handleCancel = () => {
    setUsername(user.username || "");
    setFullName(user.fullName || "");
    setEmail(user.email || "");
    setEditMode(false);
  };

  return (
    <div>
      <Avatar
        onClick={() => setIsProfileOpen(true)}
        alt={synonym}
        src="data:image/jpeg;base64,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"
        sx={{ cursor: "pointer" }}
      />
      <Modal
        isOpen={isProfileOpen}
        onClose={() => {
          setIsProfileOpen(false);
          if (editMode) handleCancel();
        }}
        topRight
      >
        <div className={`profile-modal ${editMode ? "edit-mode" : ""}`}>
          <h2 className="profile-modal_title">Profile</h2>

          <div className="profile-modal_content">
            {!editMode && (
              <div className="profile-info">
                <h2>Username: {username}</h2>
                <h2>Full name: {fullName}</h2>
                <h2>Email: {email}</h2>
              </div>
            )}

            {editMode && (
              <>
                <div className="profile-field">
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="button-group">
              <button
                className={editMode ? "save-button" : "edit-button"}
                onClick={handleEdit}
              >
                {editMode ? "Save" : "Edit Profile"}
              </button>

              {editMode && (
                <button className="cancel-button" onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </div>

            <div className="logout-section">
              <button
                className="logout-button"
                onClick={() => {
                  logOut();
                  window.location.reload();
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
