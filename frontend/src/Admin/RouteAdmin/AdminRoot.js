import { Route, Routes } from "react-router-dom";
import PasswordAdmin from "../Profile/Password";
import ProfileAdmin from "../Profile/Profile";
import AdminLayout from "../../Layout/AdminLayout";
import NewCourse from "../Course/NewCourse";

const AdminRoot = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/profile" element={<ProfileAdmin />} />
                    <Route path="/password" element={<PasswordAdmin />} />
                    <Route path="/create-course" element={<NewCourse />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoot;
