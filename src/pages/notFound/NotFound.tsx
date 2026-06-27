import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="text-[72px] font-bold text-N100 leading-none mb-3">404</div>
      <h1 className="text-xl font-bold text-N900 mb-2">Page not found</h1>
      <p className="text-sm text-N500 mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium bg-BR500 text-white rounded hover:bg-BR400 transition-colors"
        >
          <ArrowLeft size={15} /> Go back
        </button>
        <button
          onClick={() => navigate("/admin")}
          className="px-5 py-2.5 text-sm font-medium border border-N40 text-N700 rounded hover:border-N200 transition-colors"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
