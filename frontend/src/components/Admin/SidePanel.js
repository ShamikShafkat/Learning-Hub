import { Link } from "@nextui-org/react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaBookOpen,
  FaChartArea,
  FaHome,
  FaUserGraduate,
} from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import "./slide.css";
import { useState, useEffect } from "react";
import { useUser } from "../../Provider/UserProvider";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { HiOutlineUsers } from "react-icons/hi2";
import { CiBookmarkCheck } from "react-icons/ci";
const SidePanel = () => {
  const [open, setOpen] = useState(true);
  const { user } = useUser();
  const [location, setLocation] = useState(null);
  useEffect(() => {
    const location = window.location.pathname;
    setLocation(location);
  }, [user]);

  return (
    <div
      className={`h-[100vh] w-1/5 bg-blue-950 fixed z-[1000] ${
        open ? "open" : "close"
      } `}
    >
      <div className="flex items-center w-full  justify-start h-[11.9%] bg-gray-900 text-white flex-row  ">
        <div className="w-[35%]">
          <img src="/logo.png" className="w-[70px]" alt="" />
        </div>
        <div className="w-full">
          <p className="text-white font-bold  font-sans text-2xl">ELEARNING</p>
        </div>
        <div
          className="mr-[10px] cursor-pointer"
          onClick={() => {
            setOpen(!open);
          }}
        >
          {open ? <FaAngleLeft /> : <FaAngleRight />}
        </div>
      </div>
      <div className="flex flex-col items-center justify-start h-[100vh] overflow-scroll ">
        <div className=" mt-5 flex flex-col justify-center items-center w-full">
          <img
            className="w-[70px] rounded-full overflow-hidden "
            src={user?.image}
            alt=""
          />
          <p className="font-semibold text-xl text-white font-sans mt-3">
            {user?.name}
          </p>
          <p className="font-semibold text-xl text-white font-sans mt-2">
            Admin
          </p>
        </div>
        <Link
          to="/admin"
          className="cursor-pointer w-full gap-3 p-4 pl-[20%] text-white font-semibold mt-5 flex flex-row items-center justify-start hover:bg-gray-700"
        >
          <FaHome />
          Dashboard
        </Link>
        <div className="w-full border-t-[1px] border-[#ffffff2e] ">
          <div className="ml-1 w-full gap-3 px-4 pt-4 text-white font-semibold  flex flex-col items-start justify-center">
            Data
          </div>
          <Link
            to="/admin"
            className="cursor-pointer w-full gap-3 px-4 py-3 pl-[20%] text-white font-semibold  flex flex-row items-center justify-start mt-3 hover:bg-gray-700"
          >
            <HiOutlineUsers />
            Users
          </Link>
          <Link
            to="/admin"
            className="cursor-pointer w-full gap-3 px-4 py-3 pl-[20%] text-white font-semibold mt-0 flex flex-row items-center justify-start hover:bg-gray-700"
          >
            <LiaFileInvoiceSolid />
            Invoices
          </Link>
        </div>
        <div className="w-full border-t-[1px] border-[#ffffff2e] ">
          <div className="ml-1 w-full gap-3 px-4 pt-4 text-white font-semibold  flex flex-col items-start justify-center">
            Content
          </div>
          <Link
            href="/create-course"
            className={`${
              location === "/create-course" ? "active" : ""
            } cursor-pointer w-full gap-3 px-4 py-3  pl-[20%] text-white font-semibold mt-3 flex flex-row items-center justify-start hover:bg-gray-700`}
          >
            <FaBookOpen />
            Create Course
          </Link>
          <Link
            to="/admin"
            className="cursor-pointer w-full gap-3 px-4 py-3 pl-[20%] text-white font-semibold mt-0 flex flex-row items-center justify-start hover:bg-gray-700"
          >
            <FaUserGraduate />
            Courses
          </Link>
        </div>
        <div className="w-full border-t-[1px] border-[#ffffff2e] ">
          <div className="ml-1 w-full gap-3 px-4 pt-4 text-white font-semibold  flex flex-col items-start justify-center">
            Controller
          </div>
          <Link
            to="/admin"
            className=" cursor-pointer w-full gap-3 px-4 py-3 pl-[20%] text-white font-semibold mt-3 flex flex-row items-center justify-start  hover:bg-gray-700"
          >
            <TiUserAdd />
            Add Admin
          </Link>
        </div>
        <div className="w-full border-y-[1px] border-[#ffffff2e] py-3">
          <div className="ml-1 w-full gap-3 px-4 pt-4 text-white font-semibold  flex flex-col items-start justify-center">
            Analytics
          </div>
          <Link
            href="/admin"
            className="cursor-pointer w-full gap-3 px-4 py-3 pl-[20%] text-white font-semibold mt-3 flex flex-row items-center justify-start hover:bg-gray-700"
          >
            <FaChartArea />
            Course Analytics
          </Link>
        </div>

        <div className="w-full  border-[#ffffff2e] py-3 mb-[300px]">
          <Link
            to="/admin"
            className="cursor-pointer w-full gap-3 px-4 py-3 pl-[20%] text-white font-semibold mt-3 flex flex-row items-center justify-start hover:bg-gray-700"
          >
            <FaChartArea />
            FAQ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
