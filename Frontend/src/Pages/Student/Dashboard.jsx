import { useAuth } from "../../Context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="pt-10">

      <h1 className="text-4xl font-bold text-white">
        Welcome {user?.name} 👋
      </h1>

      <p className="mt-3 text-white/60">
        Welcome to Stack Adda Dashboard
      </p>

    </div>
  );
};

export default Dashboard;