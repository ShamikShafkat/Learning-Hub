import "../App.css";
import NavBar from "../Auth/Component/navbar";
import { MdOutlineEmail } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";
import { GoBookmarkFill } from "react-icons/go";
import { FaCamera } from "react-icons/fa";
import { Input } from "antd";
import { Link } from "@nextui-org/react";
import { CiLogout } from "react-icons/ci";
import { Button } from "@mui/material";
const onSearch = (value) => console.log(value);
const { Search } = Input;
function Profile() {
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
            <Link
              href="/profile"
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
            </Link>

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
              <div className="w-full flex flex-row gap-5 justify-center items-center ">
                <CiLogout className="w-[17%] h-[83%]" />

                <h1 className="flex-nowrap w-[83%] h-full flex-col text-left h-full mt-[-5px]">
                  Logout
                </h1>
              </div>
            </Link>
          </div>
        </div>
        <div className="w-[55%]  flex flex-col justify-center items-center z-[1000]">
          <div className="w-full flex flex-row w-full justify-center items-end">
            <img
              src="/home1img.png"
              alt=""
              className="w-[110px] rounded-[100px] border-[#ffffff77] border-2"
            />
            <FaCamera className="text-2xl ml-[-25px] text-[#ffffff40]" />
          </div>
          <div className="w-[50%] flex flex-col justify-start items-start mt-10">
            <div className="font-sans text-[#ffffffec] text-sm">Full Name</div>
            <Input
              value="Galib Mahmud Jim"
              size="large"
              placeholder=""
              className="custom-input mt-3"
            />
          </div>
          <div className="w-[50%] flex flex-col justify-start items-start mt-5">
            <div className="font-sans text-[#ffffffec] text-sm">Email</div>
            <Input
              value="galibamhamudjim@gmail.com"
              size="large"
              placeholder=""
              className="custom-input mt-3"
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
