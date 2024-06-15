import "../App.css";
import NavBar from "../components/navbar";
import { MdOutlineEmail } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";
import { GoBookmarkFill } from "react-icons/go";
import { FaCamera } from "react-icons/fa";
import { Input } from "antd";
import { Link } from "@nextui-org/react";
import { CiLogout } from "react-icons/ci";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import { Button } from "@mui/material";
import UserContext from "../context/UserContext";
import Background from "../components/Background";
import ProfileMenu from "../components/Users/ProfileMenu";
import MenuUserContext from "../context/MenuUserContext";

const onSearch = (value) => console.log(value);

const { Search } = Input;

function Password() {
  const { menu, setMenu } = useContext(MenuUserContext);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  setMenu("password");
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);
  const handlePassowordChange = async (e) => {
    e.preventDefault();
    try {
      if (password === "" || newPassword === "" || confirmPassword === "") {
        toast.error("All fields are required");
      } else if (newPassword !== confirmPassword) {
        toast.error("Password does not match");
      } else {
        await axios
          .put(
            "http://localhost:8000/users/change_password/",
            {
              old_password: password,
              new_password: newPassword,
            },
            {
              headers: {
                accessToken: user.accessToken,
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            toast.success("Password updated successfully", {});
          });
      }
    } catch (error) {
      const res = error.response.status;
      if (res === 400) {
        toast.error("Incorrect Password", {});
      } else if (res === 401) {
        toast.error("Unauthorized", {});
      } else {
        toast.error("Something went wrong", {});
      }
    }
  };
  return (
    <div className="App bg-[#0f1521] w-screen min-h-screen">
      <header className="flex flex-col w-[100vw] justify-center items-center h-[20vh] z-50 fixed">
        <NavBar />
      </header>
      <main className="flex flex-row w-screen bg-[#0f1521] h-screen justify-center items-center h-[80vh] pt-[20vh] z-50">
        <Background />
        <ProfileMenu />

        <div className="w-[55%]  flex flex-col justify-center items-center z-[1000]">
          <div className="w-full flex flex-row w-full justify-center items-end">
            <h1 className="text-white font-bold text-[35px] font-sans">
              Change Password
            </h1>
          </div>
          <div className="w-[50%] flex flex-col justify-start items-start mt-10">
            <div className="font-sans text-[#ffffffec] font-semibold text-sm">
              Enter old password
            </div>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="large"
              type="password"
              placeholder="Enter old password"
              className="custom-input mt-3"
            />
          </div>
          <div className="w-[50%] flex flex-col justify-start items-start mt-5">
            <div className="font-sans text-[#ffffffec] font-semibold text-sm">
              Enter new password
            </div>
            <Input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              size="large"
              type="password"
              placeholder="Enter new password"
              className="custom-input mt-3"
            />
          </div>
          <div className="w-[50%] flex flex-col justify-start items-start mt-5">
            <div className="font-sans text-[#ffffffec] font-semibold text-sm">
              Confirm your password
            </div>
            <Input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              size="large"
              type="password"
              placeholder="Confirm your password"
              className="custom-input mt-3"
            />
          </div>
          <div className="w-[50%] flex flex-col justify-start items-start mt-5">
            <Button
              variant="contained"
              className=" mt-5 text-white"
              styles="border-shade-200  shadow-sm text-shade-700  py-10"
              left="true"
              onClick={handlePassowordChange}
            >
              <h1 className="text-white">Update</h1>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Password;
