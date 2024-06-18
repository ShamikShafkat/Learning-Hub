import { Button } from "antd";
import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const EnrollCourse = ({ courses }) => {
  const navigator = useNavigate();
  useEffect(() => {
    axios.get(`http://localhost:8000/courses`);
  }, []);
  const course = {
    title: "Introduction to Machine Learning",
    description:
      "This course provides an introduction to ML, including its core concepts and topic.",
    image: "/cbg.png",
    price: "Course Price",
    category: "Course Category",
    level: "Course Level",
  };
  return (
    <div className="w-[100vw] pt-[9%] h-[100vh] flex flex-col justify-between px-6 gap-6 items-center bg-cover">
      <div className="w-[50%] h-full flex flex-col justify-start items-start pt-10">
        <h1 className="text-white font-bold text-[30px] font-sans">
          {course.title}
        </h1>
        <h1 className="w-[100%] text-white opacity-45 font-bold text-[20px] text-start font-sans mt-5">
          {course.description}
        </h1>
        <h1 className="w-[100%] text-white font-bold text-[25px] text-start font-sans mt-5">
          Introduction
        </h1>
        <h1 className="w-[100%] text-white opacity-45 font-bold text-[20px] text-start font-sans mt-5">
          This course isn't just about dipping your toes into Machine Learning
          (ML) – it's about diving headfirst into its fascinating world! We'll
          equip you with the foundational knowledge to understand this powerful
          technology that's transforming our lives.
        </h1>
        <div>
          <h1 className="w-[100%] text-white font-bold text-[25px] text-start font-sans mt-5">
            Course Details
          </h1>
          <div className="w-[100%] h-auto flex flex-col justify-start items-start w-[100%] text-white opacity-45 font-bold text-[20px] text-start font-sans mt-5">
            <h3>Catagory: ML, Python</h3>
            <h3>Level: Beginner</h3>
            <h3>Price: 123.23 USD</h3>
            <h3>Author: Galib Mahmud Jim</h3>
          </div>
        </div>

        <div className="w-[100%] h-auto flex flex-col justify-start items-end w-[100%] text-white font-bold text-[20px] text-start font-sans mt-5">
          <Button
            type="primary"
            className="font-semibold"
            onClick={() => {
              navigator("/profile");
            }}
          >
            Enroll Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnrollCourse;
