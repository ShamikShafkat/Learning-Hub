import Dropdown from "react-dropdown";
// import "react-dropdown/style.css";
import "../../App.css";
import { FileUploader } from "react-drag-drop-files";
import { useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const fileTypes = ["JPEG", "PNG", "GIF"];
const NewCourse = () => {
  const options = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [tag, setTag] = useState("");
  const [label, setLabel] = useState("");
  const [demo, setDemo] = useState("");
  const [prerequisites, setPrerequisites] = useState("");
  const [visibility, setVisibility] = useState("");
  const [course_difficulty, setCourseDifficulty] = useState("");
  const visiblity = ["FREE", "PAID"];
  const defaultOption = options[0];
  const form = document.getElementById("form");
  const submitter = document.querySelector("button[value=save]");
  const navigate = useNavigate();
  const handleCreateCourse = async (event) => {
    event.preventDefault();
    const tagList = tag.split(",");
    const prerequisitesList = prerequisites.split(",");
    const formData = new FormData(event.target);
    formData.append("course_difficulty", course_difficulty);
    formData.append("visibility_status", visibility);
    formData.append("tags", tagList);
    formData.append("prerequisites", prerequisitesList);
    formData.append("video", []);
  

    try {
      const res = await axios
        .post("http://localhost:8000/courses", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((res) => {
          console.log(res);
          const course_id = res.data._id;
          navigate(`/section/${course_id}`);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full h-auto justify-center items-center flex flex-col">
      <div className="w-full h-auto flex flex-row justify-center items-center ">
        <form
          id="form"
          className="w-[80%] h-full pl-[25%]  flex flex-col justify-start items-start pt-[15vh]"
          onSubmit={(e) => {
            // e.preventDefault(s);
            handleCreateCourse(e);
          }}
        >
          <label htmlFor="title">
            <h1 className="text-white font-bold text-[15px] font-sans">
              Course Name
            </h1>
          </label>
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="courseName"
            className="custom-input mt-3 w-[80%] !bg-[#9b8c8c58] !border-0 font-bold text-[18px] px-4 !py-3 font-sans focus:outline-none"
          />
          <label htmlFor="description">
            <h1 className="text-white font-bold text-[15px] font-sans mt-8">
              Course Description
            </h1>
          </label>
          <textarea
            type="text"
            name="description"
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="courseDescription"
            className="custom-input h-32 mt-3 w-[80%] !bg-[#9b8c8c58] !border-0 font-bold text-[18px] px-4 !py-3 font-sans focus:outline-none"
          />
          <label htmlFor="price">
            <h1 className="text-white font-bold text-[15px] font-sans mt-8">
              Course Price
            </h1>
          </label>
          <input
            type="number"
            name="price"
            placeholder="Course Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            id="coursePrice"
            className="custom-input mt-3 w-[80%] !bg-[#9b8c8c58] !border-0 font-bold text-[18px] px-4 !py-3 font-sans focus:outline-none"
          />
          <label htmlFor="courseDuration">
            <h1 className="text-white font-bold text-[15px] font-sans mt-8">
              Course Duration
            </h1>
          </label>
          <input
            type="text"
            placeholder="Course Duration"
            id="courseDuration"
            className="custom-input mt-3 w-[80%] !bg-[#9b8c8c58] !border-0 font-bold text-[18px] px-4 !py-3 font-sans focus:outline-none"
          />
          <label htmlFor="tags">
            <h1 className="text-white font-bold text-[15px] font-sans mt-8">
              Course Tag
            </h1>
          </label>
          <input
            type="text"
            placeholder="Course Tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            id="tags"
            name="tags"
            className="custom-input mt-3 w-[80%] !bg-[#9b8c8c58] !border-0 font-bold text-[18px] px-4 !py-3 font-sans focus:outline-none"
          />
          <div className="w-[80%] flex flex-row justify-between items-center">
            <div className="w-[45%]">
              <label htmlFor="course_difficulty">
                <h1 className="text-white font-bold text-[15px] font-sans mt-8">
                  Course Difficulty
                </h1>
              </label>
              <Dropdown
                options={options}
                value={course_difficulty}
                name="course_difficulty"
                onChange={(e) => setCourseDifficulty(e.value)}
                defaultOption={defaultOption}
                placeholder="Select an option"
                className="w-full mt-3 h-full"
              />
              ;
            </div>
            <div className="w-[45%]">
              <label htmlFor="Demo">
                <h1 className="text-white font-bold text-[15px] font-sans mt-8">
                  Demo Url
                </h1>
              </label>
              <input
                type="text"
                placeholder="Demo Url"
                id="Demo"
                className="custom-input h-full mt-3 w-full !bg-[#9b8c8c58] !border-0 font-bold text-[18px] px-4 !py-3 font-sans focus:outline-none"
              />
              ;
            </div>
          </div>
          <h1 className="text-white font-bold text-[15px] font-sans mt-8">
            Status
          </h1>
          <div className="w-[36%]">
            <Dropdown
              options={visiblity}
              defaultOption={visiblity[0]}
              value={visibility}
              name="visibility_status"
              onChange={(e) => setVisibility(e.value)}
              placeholder="Select an option"
              className="w-full mt-3 h-full !bg-transparent"
            />
            ;
          </div>
          <label htmlFor="prerequisites">
            <h1 className="text-white font-bold text-[15px] font-sans mt-8">
              Prerequisites
            </h1>
          </label>
          <textarea
            type="text"
            name="prerequisites"
            placeholder="Prerequisites"
            value={prerequisites}
            onChange={(e) => setPrerequisites(e.target.value)}
            id="prerequisites"
            className="custom-input h-32 mt-3 w-[80%] !bg-[#9b8c8c58] !border-0 font-bold text-[18px] px-4 !py-3 font-sans focus:outline-none"
          />

          <button
            type="submit"
            className="mt-5 my-10 p-2 py-1 rounded-sm bg-blue-500"
          >
            Next
          </button>
        </form>
        <div className="w-[20%] h-full "></div>
      </div>
    </div>
  );
};

export default NewCourse;
