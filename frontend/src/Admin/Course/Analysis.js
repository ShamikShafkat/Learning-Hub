import React, { useEffect, useState } from "react";
import CourseCard from "../../components/Course";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa";

const Analysis = () => {
  useEffect(() => {
    axios.get("http://localhost:8000/courses");
  }, []);
  const course = {
    title: "Course Title",
    description: "Course Description",
    image: "Course Image",
    price: "Course Price",
    category: "Course Category",
    level: "Course Level",
  };

  const [allCourse, setAllCourse] = useState([]);
  const fetchData = async () => {
    try {
      const res = await axios
        .get("http://localhost:8000/courses/")
        .then((res) => {
          console.log(res.data.data);
          setAllCourse(res.data.data);
          const course = res.data.data[0];
          setAllCourse([course]);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const [displayCount, setDisplayCount] = useState(3);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      setDisplayCount((prevCount) => prevCount + 3);
    }, 15000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="w-[100vw] h-full flex flex-col justify-center items-center">
      <div className="w-[100%] h-[100vh] flex flex-row justify-start pr-6 gap-6 items-center flex-wrap">
        <div className="w-[20%] h-full flex flex-col justify-start pt-[10%] items-start pl-6">
          <h1 className="text-white font-bold text-[20px] font-sans">
            All Courses
          </h1>
          <img src="/search.png" className=" w-[75%] mt-10" alt="" />
          <img src="/level.png" className=" w-[75%] mt-10" alt="" />
        </div>
        {allCourse.map((course) => (
          <CourseCard courses={course} />
        ))}
        <div>
          <FaArrowRight color=" white" />
        </div>
      </div>
    </div>
  );
};
export default Analysis;
