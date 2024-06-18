import { Button } from "antd";
import React from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaLock, FaVideo } from "react-icons/fa";

const Course = () => {
  const [menClick, setMenuClick] = useState(0);

  return (
    <div className="w-[100vw] h-[100vh] pt-[10%] flex  flex-row justify-center items-center">
      <div className="w-full h-full text-white flex flex-col justify-start items-start pl-[15%]">
        <h1 className="text-2xl ml-[-20px] font-bold">
          Introduction to Machine Learning
        </h1>
        <video width="600" className="rounded-md pt-20" controls>
          <source
            src={`/01_I._Introduction_Week_1/01_Welcome_7_min.mp4`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        <div className="w-full flex flex-row justify-between pt-5 items-center">
          <Button type="primary" className="font-semibold">
            Previous Lesson
          </Button>
          <Button type="primary" className="font-semibold">
            Previous Lesson
          </Button>
        </div>
        <div className="w-full bg-[#ffffff35] flex flex-row justify-around mt-5 py-4 px-2 rounded-md items-center">
          <div
            type=""
            className="font-semibold cursor-pointer"
            onClick={() => {
              setMenuClick(0);
            }}
          >
            Overview
          </div>
          <div
            type=""
            className="font-semibold cursor-pointer"
            onClick={() => {
              setMenuClick(1);
            }}
          >
            Resourses
          </div>
          <div
            type=""
            className="font-semibold cursor-pointer"
            onClick={() => {
              setMenuClick(2);
            }}
          >
            QnA
          </div>
          <div
            type=""
            className="font-semibold cursor-pointer"
            onClick={() => {
              setMenuClick(3);
            }}
          >
            Review
          </div>
        </div>
      </div>
      <div className="w-[50%]  pt-[2%] m-20 border-[1px] border-[#ffffff10] rounded-lg text-white pl-[2%] flex flex-col justify-start items-start ">
        <h1 className="text-2xl font-bold ">Introduction</h1>
        <h3 className="text-md opacity-45 pl-2 font-semibold mt-2">
          4 Lessons, 38 minutes
        </h3>
        <div className="w-full flex flex-row justify-start mt-5 items-start p-5 pl-10 opacity-80 cursor-pointer hover:bg-[#d9d9d935]">
          <FaVideo color="white" className="text-4xl" />
          <div className="w-full flex flex-col">
            <div className="font-semibold  text-white pl-5">Welcome</div>
            <div className="font-semibold text-[10px] opacity-55 text-white pl-5">
              4 minutes
            </div>
          </div>
        </div>
        <div className="w-full flex flex-row justify-start mt-0 items-start p-5 pt-2 pl-10 opacity-80 cursor-pointer hover:bg-[#d9d9d935]">
          <FaVideo color="white" className="text-4xl" />
          <div className="w-full flex flex-col">
            <div className="font-semibold  text-white pl-5">
              What is Machine Learning
            </div>
            <div className="font-semibold text-[10px] opacity-55 text-white pl-5">
              12 minutes
            </div>
          </div>
        </div>
        <div className="w-full flex flex-row justify-start mt-0 items-start p-5 pt-2 pl-10 opacity-80 cursor-pointer hover:bg-[#d9d9d935]">
          <FaVideo color="white" className="text-4xl" />
          <div className="w-full flex flex-col">
            <div className="font-semibold  text-white pl-5">
              Supervised Learning
            </div>
            <div className="font-semibold text-[10px] opacity-55 text-white pl-5">
              15 minutes
            </div>
          </div>
        </div>
        <div className="w-full flex flex-row justify-start mt-0 items-start p-5 pt-2 pl-10 opacity-80 cursor-pointer hover:bg-[#d9d9d935]">
          <FaVideo color="white" className="text-4xl" />
          <div className="w-full flex flex-col">
            <div className="font-semibold  text-white pl-5">
              Unsupervised Learning Introduction
            </div>
            <div className="font-semibold text-[10px] opacity-55 text-white pl-5">
              7 minutes
            </div>
          </div>
        </div>
        <div className="opacity-50">
          <h1 className="text-2xl font-bold ">Linear Regression</h1>
          <h3 className="text-md opacity-45 pl-2 font-semibold mt-2">
            2 Lessons, 15 minutes
          </h3>
          <div className="w-full flex flex-row justify-start mt-5 items-start p-5 pl-10 opacity-80 cursor-pointer hover:bg-[#d9d9d935]">
            <FaVideo color="white" className="text-4xl" />
            <div className="w-full flex flex-col">
              <div className="font-semibold  text-white pl-5">
                Model Representation
              </div>
              <div className="font-semibold text-[10px] opacity-55 text-white pl-5">
                4 minutes
              </div>
            </div>
            <FaLock />
          </div>
          <div className="w-full flex flex-row justify-start mt-0 items-start p-5 pt-2 pl-10 opacity-80 cursor-pointer hover:bg-[#d9d9d935]">
            <FaVideo color="white" className="text-4xl" />
            <div className="w-full flex flex-col">
              <div className="font-semibold  text-white pl-5">
                Cost Function
              </div>
              <div className="font-semibold text-[10px] opacity-55 text-white pl-5">
                11 minutes
              </div>
            </div>
            <FaLock />
          </div>
        </div>
        <div className="mb-5 opacity-50 ">
          <h1 className="text-2xl font-bold ">Exam</h1>
          <h3 className="text-md opacity-45 pl-2 font-semibold mt-2">5 MCQ</h3>
        </div>
      </div>
    </div>
  );
};
export default Course;
