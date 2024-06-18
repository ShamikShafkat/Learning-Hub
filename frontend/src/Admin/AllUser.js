import React, { useEffect, useState } from "react";
import CourseCard from "../../components/Course";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa";

const AllUser = () => {
  useEffect(() => {}, []);
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
    <div>
      <div className="w-[100vw] h-[100vh] flex flex-row justify-end pr-6 gap-6 items-center flex-wrap">
        {allCourse.slice(0, 3).map((course) => (
          <CourseCard courses={course} />
        ))}
        <div>
          <FaArrowRight color=" white" />
        </div>
      </div>
    </div>
  );
};
export default AllUser;
