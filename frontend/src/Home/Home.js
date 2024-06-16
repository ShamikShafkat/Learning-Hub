import "../App.css";
import NavBar from "../components/navbar";
import { useContext } from "react";
import { useEffect } from "react";

import { Input } from "antd";
import { useUser } from "../Provider/UserProvider";
const onSearch = (value) => console.log(value);
const { Search } = Input;
function Home() {
  const { logout, user } = useUser();

  return (
    <div className="App bg-[#0f1521] w-screen min-h-screen">
      <header className="flex flex-col w-[100vw] justify-center items-center h-[20vh] z-50 fixed">
        <NavBar />
      </header>
      <main className="flex flex-row w-screen bg-[#0f1521] h-screen justify-center items-center h-[80vh] pt-[20vh]">
        <ul className="background">
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
        <div className="w-full z-10">
          <img src="/home.svg" alt="" />
        </div>
        <div className="w-full pl-[10%] flex flex-col ">
          <h1 className="text-white font-[700]  text-[50px] text-left leading-[65px]">
            Improve Your Online
            <br /> Learning Experience <br />
            Better Instantly
          </h1>
          <div className="flex flex-col pl-4 mr-[20%]">
            <h4 className="text-white  font-bold text-sm text-left my-10 font-sans">
              We have more than 1000+ courses for you and 40k+ students. Find
              your desire course and start learning.
            </h4>
            <Search
              placeholder="Search for courses..."
              enterButton
              size="large"
              className="custom-search text-white font-bold"
              onSearch={onSearch}
            />
            <div className="flex flex-row justify-start items-center w-full mt-10">
              <img src="/home1img.png" alt="" />
              <img className="ml-[-15px]" src="/home2img.png" alt="" />
              <img className="ml-[-15px]" src="/home3img.png" alt="" />
              <h4 className="text-white text-left flex-nowrap font-bold text-sm text-left ml-4 font-sans">
                500k+ students already joined us.{" "}
                <span className="text-[#6dbe3f]">View Courses</span>
              </h4>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
