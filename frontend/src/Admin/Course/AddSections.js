import Dropdown from "react-dropdown";
import "../../App.css";
import { FileUploader } from "react-drag-drop-files";
import { useState, useEffect } from "react";
import { Button } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const fileTypes = ["JPEG", "PNG", "GIF"];
const AddSection = () => {
  const { id } = useParams();
  const [lessonName, setLessonName] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonVideo, setLessonVideo] = useState("");
  const [lessonResource, setLessonResource] = useState("");
  const [lessonQuiz, setLessonQuiz] = useState("");
  const [lessonAssignment, setLessonAssignment] = useState("");
  const [file, setFile] = useState();
  function handleChange(event) {
    setFile(event.target.files[0]);
  }
  const lessons = [];
  const [sectionCreated, setSectionCreated] = useState(false);
  const [section, setSection] = useState();
  const [course, setCourse] = useState();
  const [addedLesson, setAddedLesson] = useState([]);
  const navigator = useNavigate();
  useEffect(() => {
    axios.get("http://localhost:8000/courses/").then((res) => {
      const courseList = res.data.data;
      courseList.forEach((course) => {
        if (course._id === id) {
          setCourse(course);
        }
      });
    });
  }, []);
  const [section_number, setSectionNumber] = useState(0);
  const [sectionList, setSectionList] = useState([]);
  useEffect(() => {
    console.log("Sec", sectionList);
  }, [sectionList]);
  useEffect(() => {
    axios.get(`http://localhost:8000/courses/${id}`).then((res) => {
      const coursesec = res.data.data[0]?.sections;
      if (coursesec?.length > 0) {
        setSectionNumber(coursesec?.length);
        setSectionList(coursesec);
      }
    });
  }, []);
  useEffect(() => {
    // console.log(sectionList);
  }, [sectionList]);
  const handledAddedSection = async (event) => {
    event.preventDefault();

    try {
      const data = {
        title: sectionName,
        course_id: id,
        section_number: section_number + 1,
      };
      const res = await axios
        .post(`http://localhost:8000/sections/`, data, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((res) => {
          console.log(res);
          window.location.reload();
        });
    } catch (error) {
      console.log(error);
    }
  };
  const [sectionName, setSectionName] = useState("");

  return (
    <div className="w-full h-auto justify-start items-center flex flex-col">
      <div className="w-full h-auto flex flex-row justify-center items-start ">
        <div className="w-[80%] h-full pl-[25%]  flex flex-col justify-start items-start pt-[15vh]">
          <h1 className="text-white font-bold text-2xl font-sans my-10">
            {course?.title}
          </h1>
          <label htmlFor="courseName">
            <h1 className="text-white font-bold text-[15px] font-sans">
              Section Name
            </h1>
          </label>
          <input
            type="text"
            name="title"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            placeholder="Section Name"
            id="title"
            className="custom-input mt-3 w-[80%] !bg-[#9b8c8c58] !border-0 font-bold text-[18px] px-4 !py-3 font-sans focus:outline-none"
          />

          <Button
            type="primary"
            className="mt-10 font-semibold"
            onClick={(e) => {
              handledAddedSection(e);
            }}
          >
            Add New Section
          </Button>
        </div>
        <div className="w-[20%] h-[100vh] border-l-[1px]  border-[#fefcff0e]  flex flex-col items-start justify-start pt-[5%] ">
          <div className="text-white font-bold pl-5 text-xl font-sans my-10">
            <h1 className="text-white font-bold text-2xl font-sans my-10">
              Sections
            </h1>
            {sectionList?.map((section) => {
              return (
                <div
                  className="cursor-pointer mt-3"
                  onClick={() => {
                    navigator(`/lesson/${id}/${section._id}`);
                  }}
                >
                  <p>{section?.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddSection;
