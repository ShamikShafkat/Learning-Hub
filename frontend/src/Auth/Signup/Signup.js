import "./Signup.css";
import NavBar from "../../components/navbar";
import { Input } from "antd";
import { CiLock } from "react-icons/ci";
import { MdOutlineEmail, MdOutlinePhone } from "react-icons/md";
import { Button } from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "@nextui-org/react";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import Password from "antd/es/input/Password";
import { useState } from "react";

const handleSignup = async (profile) => {
  try {
    let user = JSON.parse(JSON.stringify(profile));
    console.log(user);
    const response = await axios.post(
      "http://localhost:8000/auth/register/",
      user,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
  } catch (error) {
    console.error("Error:", error);
    // Handle the error as needed
  }
};

const SignUpCTA = () => {
  const handleForgotPasswordClick = () => {};
  return (
    <div className="flex mb-5 mt-6  flex-col justify-center w-[400px] items-center">
      <div className="flex flex-row justify-between items-center gap-[70px] mt-5 mb-5 w-full">
        <div className="flex flex-row items-center justify-center whitespace-nowrap w-full">
          <p className="text-white text-[15px]  font-semibold font-sans">
            Already have an account? <span>&nbsp;</span>{" "}
          </p>
          <Link href="/login">
            <p className="text-violet-700 text-[15px]  font-bold font-opensans cursor-pointer">
              Login
            </p>
          </Link>
        </div>
      </div>
      <div className="flex-row flex justify-center items-center mt-6 w-full gap-14">
        <div className="h-[1px] bg-stone-300 w-full align-middle"></div>
        <div className="text-white text-sm font-semibold font-opensans uppercase">
          Or
        </div>
        <div className="h-[1px] bg-stone-300 w-full align-middle"></div>
      </div>
    </div>
  );
};

const Oauth = () => {
  return (
    <Button
      variant="outlined"
      className="w-full"
      styles="border-shade-200 w-[400px] shadow-sm text-shade-700 mt-4 py-10"
      left={true}
      startIcon={<FcGoogle />}
    >
      Login with google
    </Button>
  );
};
function Signup() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="App bg-[#0f1521] w-screen min-h-screen">
      <header className="flex flex-col w-[100vw] justify-center items-center  z-[100] fixed">
        <NavBar />
      </header>
      <main className="flex flex-col w-screen min-h-screen justify-start items-center  pt-[10vh] pb-[100px]">
        <ul class="background">
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
        <div className="w-[45%] bg-[#ffffff09] rounded-xl m-10 bottom-1 border-white min-w-[300px] backdrop-blur-lg  py[200px] flex flex-col justify-start items-center">
          <img src="/logo.png" className="w-[280px]" alt="" />

          <div className="text-white text-[30px] mt-[-50px] font-bold">
            Sign Up
          </div>
          <div className="w-[400px] mt-[10px] flex flex-col text-[#ffffff] font-bold text-[18px] justify-center items-start">
            <div className="font-sans text-[#fff9] text-sm">Name</div>
            <Input
              size="large"
              placeholder="Enter your name"
              className="custom-input mt-3"
              prefix={<MdOutlineEmail />}
              onChange={(e) => {
                setProfile({ ...profile, name: e.target.value });
              }}
            />
            <div className="font-sans text-[#fff9] mt-5 text-sm">Email</div>
            <Input
              size="large"
              placeholder="Enter your email"
              className="custom-input mt-3"
              prefix={<MdOutlineEmail />}
              onChange={(e) => {
                setProfile({ ...profile, email: e.target.value });
              }}
            />

            <div className="font-sans text-[#fff9] mt-5 text-sm">
              Phone Number
            </div>
            <Input
              size="large"
              placeholder="Enter your Phone Number"
              className="custom-input mt-3 "
              prefix={<MdOutlinePhone />}
              onChange={(e) => {
                setProfile({ ...profile, phone_number: e.target.value });
              }}
            />
            <div className="font-sans text-[#fff9] mt-5 text-sm">Password</div>
            <Input
              size="large"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="custom-input mt-3"
              onChange={(e) => {
                setProfile({ ...profile, password: e.target.value });
              }}
              prefix={<CiLock />}
              suffix={
                <span style={{ cursor: "pointer" }}>
                  {showPassword ? (
                    <FaEye
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    />
                  )}
                </span>
              }
            />
            <div className="w-full mt-5">
              <Button
                variant="contained"
                className="w-full mt-10"
                onClick={() => {
                  handleSignup(profile);
                }}
              >
                <div className="text-lg font-sans tracking-tighter font-bold ">
                  Signup
                </div>
              </Button>
            </div>
            <SignUpCTA />
            <Oauth />
            <div className="mb-[100px]"></div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Signup;