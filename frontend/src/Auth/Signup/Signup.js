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
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { useAuth } from "../../Provider/AuthProvider";

let isVisible = false;

const OTPVerification = ({ values }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();
  const handleOtp = async (email, otp) => {
    try {
      const response = await axios
        .post(
          "http://localhost:8000/auth/verifyEmail/",
          {
            email: email,
            token: otp,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            isVisible = false;
            toast.success("Verification Successful", {
              position: "top-right",
              autoClose: 3000,
              theme: "dark",
              pauseOnHover: false,
            });
            navigate("/login", { shallow: true });
          } else if (res.status === 400) {
            toast.error("Your verification code has been expired.", {
              position: "top-right",
              autoClose: 3000,
              theme: "dark",
              pauseOnHover: false,
            });
          } else {
            toast.error("Verification Failed.", {
              position: "top-right",
              autoClose: 3000,
              theme: "dark",
              pauseOnHover: false,
            });
          }

          return null;
        });
    } catch (error) {
      console.error("Error:", error);

      toast.error("Verification Failed", {
        position: "top-right",
        theme: "dark",
      });
      window.location.reload();
    }
  };

  if (!isVisible) return null;
  return (
    <div className="fixed  inset-0 z-[1000] bg-black backdrop-blur-sm bg-opacity-25 h-screen w-screen flex flex-col items-center justify-center otp">
      <div className="w-[663px] h-[475px] bg-white rounded-lg flex flex-col justify-center items-center container">
        <div className="text-black text-[28px] font-bold font-opensans title">
          OTP Verification
        </div>
        <div className="w-[80%] h-[30%] mt-[5%] p-5 rounded-lg bg-emerald-100 flex flex-col justify-center items-center instru-con">
          <div className="w-full text-center text-green-700 text-[22px] font-normal font-opensans instruction">
            We’ve sent a verification code to your email <br />
            <span className="font-bold">#{values.email}</span>
          </div>
        </div>
        <div className="w-full flex flex-col justify-center items-center ">
          <input
            name="otp"
            type="text"
            placeholder="Enter your verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-[80%] h-15 mt-7  py-[19px] bg-white rounded-[10px] border border-stone-300 justify-start items-center input font-extrabold text-xl text-center "
          />
          <div className="w-full mt-5">
            <Button
              variant="outlined"
              className="w-[20%]"
              onClick={() => {
                handleOtp(values.email, verificationCode);
              }}
            >
              <div className="text-lg font-sans tracking-tighter font-bold ">
                Submit
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
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
      left="true"
      startIcon={<FcGoogle />}
    >
      Login with google
    </Button>
  );
};
function Signup() {
  useEffect(() => {}, [isVisible]);
  const { isAuth } = useAuth();

  useEffect(() => {
    if (isAuth) {
      navigate("/profile", { replace: true });
    }
  }, [isAuth]);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleSignup = async (profile) => {
    try {
      let user = JSON.parse(JSON.stringify(profile));
      const response = await axios
        .post("http://localhost:8000/auth/register/", user, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          isVisible = true;
          toast.success("OTP Sent", {
            position: "top-right",
            autoClose: 3000,
            theme: "dark",
          });
        });
    } catch (error) {
      // window.location.reload();
      const res = error.response.status;
      if (res === 400) {
        toast.error("User already exists", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      } else {
        toast.error("Signup Failed", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      }
      console.error("Error:", error);
    }
  };

  return (
    <div className="App bg-[#0f1521] w-screen min-h-screen">
      <OTPVerification values={profile} />
      <header className="flex flex-col w-[100vw] justify-center items-center  z-[100] fixed">
        <NavBar />
      </header>
      <main className="flex flex-col w-screen min-h-screen justify-start items-center  pt-[10vh] pb-[100px]">
        <ul className="background">
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
