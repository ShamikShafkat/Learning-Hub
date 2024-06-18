import { Container } from "@mui/material";
import HashLoader from "react-spinners/HashLoader";

const Loading = ({ show }) => {
  return (
    show && (
      <div className="fixed flex  backdrop-blur-[2px] w-[100%] h-[100vh]  justify-center align-middle items-center  z-[1] ">
        <HashLoader color={"#EA5F39"} size={150} speedMultiplier={1} />
      </div>
    )
  );
};

export default Loading;
