import SidePanel from "../components/Admin/SidePanel";

const AdminLayout = ({ children }) => {
  return (
    <div className="w-screen h-screen">
      <SidePanel />
      {children}
    </div>
  );
};

export default AdminLayout;
