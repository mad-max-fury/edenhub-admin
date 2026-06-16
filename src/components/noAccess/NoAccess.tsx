import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "../buttons";
import { Typography } from "../typography";
import { AuthRouteConfig } from "@/constants/routes";

interface NoAccessProps {
  homePath?: string;
}

export const NoAccess: React.FC<NoAccessProps> = ({
  homePath = AuthRouteConfig.DASHBOARD,
}) => {
  const navigate = useNavigate();
  return (
    <div className="h-full min-h-[60vh] flex flex-col items-center justify-center text-center gap-4 px-6">
      <div className="w-16 h-16 rounded-2xl bg-R50/40 text-R500 flex items-center justify-center">
        <ShieldAlert size={32} />
      </div>
      <div className="space-y-1 max-w-md">
        <Typography variant="h-m" fontWeight="bold">
          You don't have access to this page
        </Typography>
        <Typography variant="p-m" color="N500">
          Your role doesn't include permission for this area. Contact an
          administrator if you think this is a mistake.
        </Typography>
      </div>
      <Button variant="brown-light" onClick={() => navigate(homePath)}>
        Go to a page you can access
      </Button>
    </div>
  );
};

export default NoAccess;
