"use client";
import Image from "next/image";
import { Button } from "../Button";
import { useState } from "react";
import avatarDefault from "./empty-avatar.png";
export const ProfileImageUploader = ({ user }) => {
  const [imgSrc, setImgSrc] = useState(
    user.avatar ?? user.image ?? avatarDefault
  );
  const [newAvatar, setNewAvatar] = useState(null);

  const uploadAvatar = async (e) => {
    e.preventDefault();
    if (!newAvatar) return;
    const formData = new FormData();
    formData.append("avatar", newAvatar);
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setImgSrc(data.avatar);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
          setImgSrc(reader.result);
     };
     reader.readAsDataURL(file);
    }
  };
  if (!user) return null;
  return (
    <>
      <ul>
        <li>{user.name}</li>
        <li>
          <Image src={imgSrc} alt={user.name} width={254} height={254}  />
        </li>
      </ul>
      <form onSubmit={uploadAvatar}>
        <input required type="file" onChange={handleFileChange} />
        <Button type="submit">Upload</Button>
      </form>
    </>
  );
};
