import { Link } from "@nextui-org/react";
import { CiLogout } from "react-icons/ci";
import { GoBookmarkFill } from "react-icons/go";
import { MdLockOutline } from "react-icons/md";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserContext from "../../context/UserContext";
import axios from "axios";
import MenuUserContext from "../../context/MenuUserContext";
import "./UserMenu.css";

const ProfileMenu = () => {
  const { logout, user } = useContext(UserContext);
  const navigate = useNavigate();
  const { menu, setMenu } = useContext(MenuUserContext);
  useEffect(() => {
    if (!user) {
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
        navigate("/login");
      } else {
        toast.error("Something went wrong", {});

        localStorage.removeItem("accessToken");
        logout();
        navigate("/login");
      }
      console.log(error);
    }
  };
  return (
    <div className="w-[40%]  z-10 flex h-full flex-col justify-center items-start ">
      <div className=" flex flex-col bg-[#FFFFFF09] w-[60%] justify-start items-start  h-[50vh] font-sans text-lg text-white font-semibold ml-[15%]  rounded-lg border-2 border-[#ffffff2a]">
        <div
          onClick={() => {
            navigate("/profile");
          }}
          className={`flex flex-row w-full flex flex-row gap-5 justify-center items-center focus:bg-transparent  pl-5 pr-5 py-3 pt-5 justify-center items-center hover:bg-[#615a5aa9] border-transparent border-y-[1px] hover:border-[#fffdfd2c] ${
            menu === "profile" ? "active" : ""
          }`}
        >
          <div className="w-full flex flex-row gap-5 justify-center items-center ">
            <div className="w-[17%]">
              <img src={user.image} alt="" className="rounded-3xl" />
            </div>

            <h1 className="flex-nowrap w-[83%] h-full flex-col text-left h-full mt-[-5px]">
              My Account
            </h1>
          </div>
        </div>

        <Link
          href="/password"
          className={`flex flex-row w-full flex flex-row gap-5 justify-center items-center focus:bg-transparent  pl-5 pr-5 py-3 pt-5 justify-center items-center hover:bg-[#615a5aa9] border-transparent border-y-[1px] hover:border-[#fffdfd2c] ${
            menu === "password" ? "active" : ""
          }`}
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
          className={`flex flex-row w-full flex flex-row gap-5 justify-center items-center focus:bg-transparent  pl-5 pr-5 py-3 pt-5 justify-center items-center hover:bg-[#615a5aa9] border-transparent border-y-[1px] hover:border-[#fffdfd2c] ${
            menu === "enrolled" ? "active" : ""
          }`}
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
  );
};

export default ProfileMenu;
