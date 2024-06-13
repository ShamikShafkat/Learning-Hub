import React from "react";
import Button from "@mui/material/Button";
import { Link } from "@nextui-org/react";

export default function NavBar() {
  return (
    <div className="w-screen z-[1000] h-[12vh] top-0 fixed bg-[#0f1521] border-b-[1px] border-[#dcecfc4e] flex flex-row justify-between items-center py-4 px-7 ">
      <div className="w-[20%] flex flex-row justify-start items-center">
        <img src="/logo.png" className="w-[90px]" alt="" />
        <h1 className="text-white font-[900] text-xl">ELEARNING</h1>
      </div>
      <div className="w-full">
        <ul className="flex flex-row justify-end gap-10 text-white font-semibold text-lg items-center mr-[100px]">
          <li>
            <Link href="/#">Home</Link>
          </li>
          <li>
            <Link href="/#">Course</Link>
          </li>
          <li>
            <Link href="/#">About</Link>
          </li>
          <li>
            <Link href="/#">Policy</Link>
          </li>
          <li>
            <Link href="/#">FAQ</Link>
          </li>
          <li>
            <Link href="/login">
              <Button variant="outlined">Join</Button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
