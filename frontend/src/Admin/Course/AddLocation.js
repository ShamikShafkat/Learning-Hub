import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "antd";
import { useLocation } from "react-router-dom";
import { duration } from "@mui/material";
import { toast } from "react-toastify";
const AddLesson = () => {
  const params = useParams();
  const course_id = params.course_id;
  const section_id = params.section_id;

  const [lessonName, setLessonName] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonVideo, setLessonVideo] = useState("");
  const [lessonResource, setLessonResource] = useState("");
  const [lessonQuiz, setLessonQuiz] = useState("");
  const [lessonAssignment, setLessonAssignment] = useState("");
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState(null);
  function handleChange(event) {
    setFile(event.target.files[0]);
  }
  // useEffect(() => {
  //   alert(customerId);
  // }, []);
  const lessons = [];
  const [sectionCreated, setSectionCreated] = useState(false);
  const [section, setSection] = useState();
  const [course, setCourse] = useState();
  const [addedLesson, setAddedLesson] = useState([]);
  const [lessonnumber, setLessonNumber] = useState(0);
  const fetch = async () => {
    try {
      const res1 = await axios
        .get(`http://localhost:8000/courses/${course_id}`)
        .then((res) => {
          const course = res.data.data[0];
          setCourse(course);
          const sections = course.sections;
          sections.forEach((section) => {
            if (section._id === section_id) {
              setSection(section);
              console.log(section);
            }
          });
        });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  const [sectionName, setSectionName] = useState("");

  const handledAddedLesson = async (event) => {
    event.preventDefault();

    try {
      await axios
        .post(
          "http://localhost:8000/lessons/",
          {
            video: file,
            pdf: null,
            title: lessonName,
            section_id: section_id,
            description: lessonDescription,
            duration: 4,
            lesson_number: 4,
          },
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          toast.success("Lesson Added Successfully");

          console.log(res);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-auto justify-center items-center flex flex-col">
      <div className="w-full h-auto flex flex-row justify-center items-center ">
        <div className="w-[80%] h-full pl-[25%]  flex flex-col justify-start items-start pt-[15vh]">
          <h1 className="text-white font-bold text-2xl font-sans my-10">
            {course?.title}
          </h1>
          <label htmlFor="courseName">
            <h1 className="text-white font-bold text-[15px] font-sans">
              {section?.title}
            </h1>
          </label>
          <div className="w-full h-auto justify-center items-start flex flex-col">
            <div className="w-full h-auto flex flex-row justify-start items-center ">
              <div className="w-full h-full   flex flex-col justify-start items-start pt-[5vh]">
                <label htmlFor="courseName">
                  <h1 className="text-white font-bold text-[15px] font-sans">
                    Lesson Name
                  </h1>
                </label>
                <input
                  type="text"
                  name="title"
                  value={lessonName}
                  onChange={(e) => setLessonName(e.target.value)}
                  placeholder="Lesson Name"
                  id="title"
                  className="custom-input mt-3 w-[80%] !bg-[#9b8c8c58] !border-0 font-bold text-[18px] px-4 !py-3 font-sans focus:outline-none"
                />
                <label htmlFor="courseName">
                  <h1 className="text-white font-bold text-[15px] font-sans mt-2">
                    Lesson Description
                  </h1>
                </label>
                <textarea
                  type="text"
                  name="description"
                  value={lessonDescription}
                  onChange={(e) => setLessonDescription(e.target.value)}
                  placeholder="Lesson Description"
                  id="description"
                  className="custom-input mt-3 w-[80%] !bg-[#9b8c8c58] !border-0 font-bold text-[18px] px-4 !py-3 font-sans focus:outline-none"
                />
                <label htmlFor="courseName">
                  <h1 className="text-white font-bold text-[15px] font-sans mt-3">
                    Lesson Video
                  </h1>
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    setFileName(e.target.files[0].name);
                  }}
                  placeholder="Lesson Video"
                  id="video"
                  className="custom-input mt-3 w-[80%] !bg-[#9b8c8c58] !border-0 font-bold text-[18px] px-4 !py-3 font-sans focus:outline-none"
                />
              </div>
            </div>
          </div>
          <Button
            type="primary"
            className="mt-10 font-semibold"
            onClick={(e) => {
              handledAddedLesson(e);
            }}
          >
            Add New Lesson
          </Button>
        </div>
        <div className="w-[20%] h-full "></div>
      </div>
    </div>
  );
};
export default AddLesson;
