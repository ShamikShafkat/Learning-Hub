import "./login.css";
import NavBar from "../../components/navbar";
import { Input } from "antd";
import { CiLock } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { Button } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { Link } from "@nextui-org/react";
const SignUpCTA = () => {
  const handleForgotPasswordClick = () => {};
  return (
    <div className="flex mb-5 mt-6  flex-col justify-center w-[400px] items-center">
      <div className="flex flex-row justify-between items-center gap-[70px] mt-5 mb-5 w-full">
        <div
          className="text-white text-[15px] font-semibold font-sans cursor-pointer whitespace-nowrap"
          onClick={handleForgotPasswordClick}
        >
          Forgot password?
        </div>
        <div className="flex flex-row items-center justify-center whitespace-nowrap w-full">
          <p className="text-white text-[15px]  font-semibold font-sans">
            Don’t have an account? <span>&nbsp;</span>{" "}
          </p>
          <Link href="/signup">
            <p
              className="text-violet-700 text-[15px]  font-bold font-opensans cursor-pointer"
              onClick={() => {}}
            >
              Signup
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
function Login() {
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
        <div className="w-[45%]  bg-[#ffffff09] rounded-xl m-10  bottom-1 border-white min-w-[300px] backdrop-blur-lg  py[200px] flex flex-col justify-start items-center">
          <img src="/logo.png" className="w-[280px] mt-[-30px]" alt="" />

          <div className="text-white text-[30px] mt-[-30px] font-bold">
            Hey,it's good to see you again!
          </div>
          <div className="text-lg mt-5 font-normal text-white">
            Please enter your credentials to continue
          </div>
          <div className="w-[400px] mt-[30px] flex flex-col text-[#ffffff] font-bold text-[18px] justify-center items-start">
            <div className="font-sans text-[#fff9] text-sm">Email</div>
            <Input
              size="large"
              placeholder="Enter your password"
              className="custom-input mt-3"
              prefix={<MdOutlineEmail />}
            />
            <div className="font-sans text-[#fff9] mt-5 text-sm">Password</div>
            <Input
              size="large"
              type="password"
              placeholder="Enter your email"
              className="custom-input mt-3"
              prefix={<CiLock />}
            />
            <div className="w-full mt-5">
              <Button variant="contained" className="w-full mt-10">
                <div className="text-lg font-sans tracking-tighter font-bold ">
                  LOGIN
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

export default Login;
