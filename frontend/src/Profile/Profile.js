import "../App.css";
import NavBar from "../components/navbar";
import { MdOutlineEmail } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";
import { GoBookmarkFill } from "react-icons/go";
import { FaCamera } from "react-icons/fa";
import { Input, theme } from "antd";
import { Link } from "@nextui-org/react";
import { CiLogout } from "react-icons/ci";
import { Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const onSearch = (value) => console.log(value);

const { Search } = Input;

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
function Profile() {
  const { logout, user, fetchUser } = useContext(UserContext);
  const [name, setName] = useState(user && user.name ? user.name : "");
  const [email, setEmail] = useState(user && user.email ? user.email : "");
  const [phone, setPhone] = useState(
    user && user.phone_number ? user.phone_number : ""
  );
  const [img, setImg] = useState(user && user.image ? user.image : "");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [image64, setImage64] = useState(null);
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = async () => {
        setImageUrl(reader.result);
        const base64 = await convertToBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      setEmail(user.email ? user.email : "");
      setName(user.name ? user.name : "");
      setPhone(user.phone_number ? user.phone_number : "");
      setImg(user.image ? user.image : "");
    } else {
      navigate("/login");
    }
  }, [user]);
  const logoutHandle = async (e) => {
    localStorage.removeItem("accessToken");

    try {
      const res = await axios
        .post("http://localhost:8000/auth/logout/", {
          headers: {
            accessToken: user.accessToken,
          },
        })
        .then((res) => {
          toast.success("Logged out successfully");
          console.log(res.data);
          if (res.data.status === 200) {
            toast.success("Logged out successfully", {});
          }
          localStorage.removeItem("accessToken");
          logout();
          navigate("/login");
        });
    } catch (error) {
      const res = error.response.status;
      if (res === 400 || res === 404) {
        toast.error("Something went wrong", {});

        localStorage.removeItem("accessToken");
        logout();
      } else {
        toast.error("Something went wrong", {});

        localStorage.removeItem("accessToken");
        logout();
      }
      console.log(error);
    }
  };
  return (
    <div className="App bg-[#0f1521] w-screen min-h-screen">
      <header className="flex flex-col w-[100vw] justify-center items-center h-[20vh] z-50 fixed">
        <NavBar />
      </header>
      <main className="flex flex-row w-screen bg-[#0f1521] h-screen justify-center items-center h-[80vh] pt-[20vh] z-50">
        <ul class="background">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <div className="w-[40%]  z-10 flex h-full flex-col justify-center items-start ">
          <div className=" flex flex-col bg-[#FFFFFF09] w-[60%] justify-start items-start  h-[50vh] font-sans text-lg text-white font-semibold ml-[15%]  rounded-lg border-2 border-[#ffffff2a]">
            <div
              onClick={() => {
                navigate("/profile");
              }}
              // href="/profile"
              className="flex flex-row w-full border-y-[1px] bg-[#7f787847] border-[#fffdfd2c] pl-5 pr-5 py-3 pt-5 justify-center items-center hover:bg-[#615a5aa9] hover:border-y-[1px] hover:border-[#fffdfd2c]"
            >
              <div className="w-full flex flex-row gap-5 justify-center items-center ">
                <div className="w-[17%]">
                  <img src="/home1img.png" alt="" className="" />
                </div>

                <h1 className="flex-nowrap w-[83%] h-full flex-col text-left h-full mt-[-5px]">
                  My Account
                </h1>
              </div>
            </div>

            <Link
              href="/password"
              className="flex flex-row w-full border-y-[1px] border-transparent pl-5 pr-5 py-3 pt-5 justify-center items-center hover:bg-[#615a5a18] hover:border-y-[1px] hover:border-[#fffdfd2c]"
            >
              <div className="w-full flex flex-row gap-5 justify-center items-center focus:bg-transparent ">
                <MdLockOutline className="w-[17%] h-[83%]" />

                <h1 className="flex-nowrap w-[83%] h-full flex-col text-left h-full mt-[-5px]">
                  Password
                </h1>
              </div>
            </Link>
            <Link
              href="/profile"
              className="flex flex-row w-full border-y-[1px] border-transparent pl-5 pr-5 py-3 pt-5 justify-center items-center hover:bg-[rgba(97,90,90,0.09)] hover:border-y-[1px] hover:border-[#fffdfd2c]"
            >
              <div
                href="/profile"
                className="w-full flex flex-row gap-5 justify-center items-center "
              >
                <GoBookmarkFill className="w-[17%] h-[83%]" />

                <h1 className="flex-nowrap w-[83%] h-full flex-col text-left h-full mt-[-5px]">
                  Enrolled Courses
                </h1>
              </div>
            </Link>
            <Link
              href="/profile"
              className="flex flex-row w-full border-y-[1px] border-transparent pl-5 pr-5 py-3 pt-5 justify-center items-center hover:bg-[#615a5a18] hover:border-y-[1px] hover:border-[#fffdfd2c]"
            >
              <div
                className="w-full flex flex-row gap-5 justify-center items-center "
                onClick={logoutHandle}
              >
                <CiLogout className="w-[17%] h-[83%]" />

                <h1 className="flex-nowrap w-[83%] h-full flex-col text-left h-full mt-[-5px]">
                  Logout
                </h1>
              </div>
            </Link>
          </div>
        </div>

        <div className="w-[55%]  flex flex-col justify-center items-center z-[1000]">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }} // Hide the file input
          />

          <div
            className="w-[110px] h-[110px] rounded-[500px] overflow-hidden flex flex-row  justify-center items-end cursor-pointer "
            onClick={handleImageClick}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Selected"
                className="w-full h-full scale-[1.4]  border-[#ffffff77] border-2"
              />
            ) : (
              <img
                src={user && user.image ? user.image : user.image}
                alt=""
                className=" w-full h-full scale-[1.4] border-[#ffffff77] border-2"
              />
            )}
            <FaCamera className=" absolute text-2xl ml-[50px] z-100 text-[#282222] shadow-xl stroke-white" />
          </div>
          <div className="w-[50%] flex flex-col justify-start items-start mt-10">
            <div className="font-sans text-[#ffffffec] text-sm">Full Name</div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="large"
              placeholder=""
              className="custom-input mt-3"
            />
          </div>

          <div className="w-[50%] flex flex-col justify-start items-start mt-5">
            <div className="font-sans text-[#ffffffec] text-sm">
              Phone Number
            </div>
            <Input
              value={phone}
              size="large"
              placeholder=""
              className="custom-input mt-3 "
            />
          </div>
          <div className="w-[50%] flex flex-col justify-start items-start mt-5">
            <div className="font-sans text-[#ffffffec] text-sm">Email</div>
            <Input
              value={email}
              size="large"
              placeholder=""
              className="custom-input mt-3 !text-[#ffffff83] !border-[#ffffff61 !border-[1px] disabled:bg-[#ffffff09] disabled:text-[#ffffff83] disabled:border-[#ffffff61] disabled:cursor-not-allowed"
            />
          </div>
          <div className="w-[50%] flex flex-col justify-start items-start mt-5">
            <Button
              variant="contained"
              className=" mt-5 text-white"
              styles="border-shade-200  shadow-sm text-shade-700  py-10"
              left={true}
            >
              <h1 className="text-white">Update</h1>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
