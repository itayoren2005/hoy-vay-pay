import React, { useEffect, useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { Modal } from "./Modal";
import { useAuth } from "./AuthProvider";

export const Profile = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [synonym, setSynonym] = useState("");
  const { user } = useAuth();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setUsername(user.username);
      setEmail(user.email);
    }
    setSynonym(
      fullName
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase())
        .join("")
    );
  }, []);

  const handleEdit = () => {};

  return (
    <div>
      <Avatar onClick={() => setIsProfileOpen(true)} alt={synonym} src="" />
      <Modal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        topRight
      >
        <div className="profile-modal">
          <h2 className="profile-modal_title">Profile</h2>
          <div className="profile-modal_content">
            <h2>Username: {username}</h2>
            <h2>Full name: {fullName}</h2>
            <h2>Email: {email}</h2>
          </div>
        </div>
      </Modal>
    </div>
  );
};
