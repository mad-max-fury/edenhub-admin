import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldOff } from "lucide-react";
import { AuthRouteConfig } from "@/constants/routes";

interface NoAccessProps {
  homePath?: string;
}

export const NoAccess: React.FC<NoAccessProps> = ({
  homePath = AuthRouteConfig.DASHBOARD,
}) => {
  const navigate = useNavigate();
  return (
    <div className="h-full min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="w-14 h-14 rounded-full bg-R50 grid place-items-center mb-4">
        <ShieldOff size={24} className="text-R500" />
      </div>
      <h1 className="text-lg font-bold text-N900 mb-1.5">Access denied</h1>
      <p className="text-sm text-N500 mb-6 max-w-sm">
        Your role doesn&apos;t include permission for this area. Contact an administrator if you think this is a mistake.
      </p>
      <button
        onClick={() => navigate(homePath)}
        className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium bg-BR500 text-white rounded hover:bg-BR400 transition-colors"
      >
        <ArrowLeft size={15} /> Go to dashboard
      </button>
    </div>
  );
};

export default NoAccess;
