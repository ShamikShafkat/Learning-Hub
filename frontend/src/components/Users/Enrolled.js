import { Button } from "antd";

const Enroll = ({ courses }) => {
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
      <h1 className="text-white font-bold text-[30px] font-sans">
        No Course Found
      </h1>
    </div>
  );
};

export default Enroll;
