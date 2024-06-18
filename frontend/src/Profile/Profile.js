import "../App.css";
import NavBar from "../components/navbar";
import { FaCamera } from "react-icons/fa";
import { Input, theme } from "antd";
import ProfileMenu from "../components/Users/ProfileMenu";
import { Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Background from "../components/Background";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useUser } from "../Provider/UserProvider";
import { useMenu } from "../Provider/MenuProvider";
const { Search } = Input;

function Profile() {
  const { menu, setMenu } = useMenu();
  const { logout, user } = useUser();
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const navigate = useNavigate();
  const [img, setImg] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [image64, setImage64] = useState(null);
  setMenu("profile");
  const cropImage = (base64) => {
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, 100, 100);
      let croppedBase64 = canvas.toDataURL();
      croppedBase64 = croppedBase64.replace(
        /^data:image\/(png|jpg);base64,/,
        ""
      );
      setImage64(croppedBase64);
    };
  };
  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      if (!(file instanceof Blob)) {
        console.error("Input is not a Blob or File", file);
        reject("Input is not a Blob or File");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        let base64 = reader.result;
        cropImage(base64);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  useEffect(() => {
    if (user) {
      setEmail(user.email ? user.email : "");
      setName(user.name ? user.name : "");
      setPhone(user.phone_number ? user.phone_number : "");
      setImg(user.image ? user.image : "");
    }
  }, [user]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = async () => {
        setImageUrl(reader.result);
      };
      convertToBase64(file)
        .then(async (base64) => {
          setImage64(base64);
        })
        .catch((error) => {
          console.error("Error converting file to base64:", error);
        });
      reader.readAsDataURL(file);
    }
  };

  const updateProfile = async () => {
    let newData = {
      name: name,
      email: email,
      phone_number: phone,
    };
    if (image64) {
      newData.image = image64;
    }
    try {
      await axios
        .put("http://localhost:8000/users/update_profile", newData, {
          headers: {
            accessToken: user.accessToken,
          },
        })
        .then((res) => {
          toast.success("Profile updated successfully", {});
        });
      window.location.reload();
    } catch (error) {
      const res = error.response;

      toast.error(res.data.message, {});
      console.log(error);
    }
  };
  return (
    <div className="App bg-[#0f1521] w-screen min-h-screen">
      <header className="flex flex-col w-[100vw] justify-center items-center h-[20vh] z-50 fixed">
        <NavBar />
      </header>
      <main className="flex flex-row w-screen bg-[#0f1521] h-screen justify-center items-center h-[80vh] pt-[20vh] z-50">
        <Background />
        <ProfileMenu />
        <div className="w-[55%]  flex flex-col justify-center items-center z-[10]">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }} // Hide the file input
          />

          <div
            className="w-[110px] h-[110px] rounded-[500px] overflow-hidden flex flex-row  justify-center items-end cursor-pointer "
            onClick={handleImageClick}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Selected"
                className="w-full h-full scale-[1.4]  border-[#ffffff77] border-2"
              />
            ) : (
              <img
                src={user && user.image ? user.image : ""}
                alt=""
                className=" w-full h-full scale-[1.4] border-[#ffffff77] border-2"
              />
            )}
            <FaCamera className=" absolute text-2xl ml-[50px] z-100 text-[#282222] shadow-xl stroke-white" />
          </div>
          <div className="w-[50%] flex flex-col justify-start items-start mt-10">
            <div className="font-sans text-[#ffffffec] text-sm">Full Name</div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="large"
              placeholder=""
              className="custom-input mt-3"
            />
          </div>

          <div className="w-[50%] flex flex-col justify-start items-start mt-5">
            <div className="font-sans text-[#ffffffec] text-sm">
              Phone Number
            </div>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              size="large"
              placeholder=""
              className="custom-input mt-3 "
            />
          </div>
          <div className="w-[50%] flex flex-col justify-start items-start mt-5">
            <div className="font-sans text-[#ffffffec] text-sm">Email</div>
            <Input
              value={email}
              size="large"
              placeholder=""
              className="custom-input mt-3 !text-[#ffffff83] !border-[#ffffff61 !border-[1px] disabled:bg-[#ffffff09] disabled:text-[#ffffff83] disabled:border-[#ffffff61] disabled:cursor-not-allowed"
            />
          </div>
          <div className="w-[50%] flex flex-col justify-start items-start mt-5">
            <Button
              variant="contained"
              className=" mt-5 text-white"
              styles="border-shade-200  shadow-sm text-shade-700  py-10"
              left="true"
              onClick={updateProfile}
            >
              <h1 className="text-white">Update</h1>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
