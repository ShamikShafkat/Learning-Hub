import { Route, Routes } from "react-router-dom";
import PasswordAdmin from "../Profile/Password";
import ProfileAdmin from "../Profile/Profile";
import AdminLayout from "../../Layout/AdminLayout";
import NewCourse from "../Course/NewCourse";
import AddSection from "../Course/AddSections";
import AddLesson from "../Course/AddLocation";
import AllCourse from "../Course/AllCourse";
const AdminRoot = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/profile" element={<ProfileAdmin />} />
        <Route path="/password" element={<PasswordAdmin />} />
        <Route path="/create-course" element={<NewCourse />} />
        <Route path="/section/:id" element={<AddSection />} />
        <Route path="/lesson/:course_id/:section_id" element={<AddLesson />} />

        <Route path="/Courses" element={<AllCourse />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoot;
