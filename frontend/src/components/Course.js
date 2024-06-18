"use client";
import { Button } from "antd";
import React, { useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ courses }) => {
  const navigator = useNavigate();
  const array = [1, 2, 3];
  const course = {
    title: courses?.title,
    description: courses?.description,
    image: "/cbg.png",
    price: courses?.visibility_status === "FREE" ? "Free" : courses?.price,
    category: courses?.tags[0],
    level: courses?.course_difficulty,
    rating: courses?.rating,
  };
  return (
    <div className="w-[23%] h-[50%] rounded-xl bg-[#838080] flex flex-col justify-center items-center">
      <img
        className="w-[100%] h-[50%] rounded-t-xl"
        src={course.image}
        alt=""
      />
      <div className="w-full h-[50%] flex flex-col justify-start mt-2 items-center">
        <div className="w-full px-3 flex flex-row justify-between">
          <h1 className="text-white font-bold text-[15px] font-sans">
            {course.title}
          </h1>
          <h1 className="w-[25%] text-white font-bold text-[12px] opacity-55 font-sans">
            3 Enrolled
          </h1>
        </div>
        <div className="w-full px-3 flex mt-1 flex-row justify-between">
          <p className="text-white font-bold text-[13px] font-sans">
            {course.description}
          </p>
        </div>
        <div className="w-full  px-3 pt-5 flex mt-1 flex-row justify-between">
          <p className="text-white font-bold text-[13px] flex flex-row justify-center items-center font-sans">
            <GoDotFill color="blue" /> {course.category}
          </p>

          <p className="text-white font-bold text-[13px] flex flex-row justify-center items-center font-sans">
            <GoDotFill color="blue" /> {course.level}
          </p>

          <p className="text-white font-bold text-[13px] flex flex-row justify-center items-center font-sans">
            <GoDotFill color="blue" /> {course.price}
          </p>
        </div>
        <div className="w-full  px-3 pt-5 flex mt-1 flex-row justify-between">
          <p className="text-white font-bold text-[15px] flex flex-row justify-center items-center gap-1 font-sans">
            <FaStar color="yellow" /> {course.rating} (0 review)
          </p>

          <Button
            type="primary"
            className="font-semibold"
            onClick={() => {
              navigator("/course/6670f39979aa419388dd444d");
            }}
          >
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
