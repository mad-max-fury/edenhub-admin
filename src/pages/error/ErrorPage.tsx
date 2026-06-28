import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Home, RotateCcw } from "lucide-react";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "Something went wrong";
  let message = "An unexpected error occurred. Please try again.";
  let code = "";

  if (isRouteErrorResponse(error)) {
    code = String(error.status);
    title = error.status === 404 ? "Page not found" : "Request failed";
    message =
      error.status === 404
        ? "The page you're looking for doesn't exist or has been moved."
        : error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen bg-N10 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-N30 max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-R50 grid place-items-center mx-auto mb-5">
          <AlertTriangle size={28} className="text-R500" />
        </div>

        {code && (
          <div className="text-[48px] font-bold text-N200 leading-none mb-2">
            {code}
          </div>
        )}

        <h1 className="text-xl font-bold text-N900 mb-2">{title}</h1>

        <p className="text-sm text-N500 mb-6 leading-relaxed">{message}</p>

        {error instanceof Error && import.meta.env.DEV && (
          <details className="mb-6 text-left">
            <summary className="text-xs text-N400 cursor-pointer hover:text-N600 mb-2">
              Stack trace
            </summary>
            <pre className="text-[10px] text-R400 bg-R50 rounded-lg p-3 overflow-x-auto max-h-[200px] whitespace-pre-wrap">
              {error.stack}
            </pre>
          </details>
        )}

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium bg-BR500 text-white rounded-lg hover:bg-BR400 transition-colors"
          >
            <RotateCcw size={14} /> Try again
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium border border-N40 text-N700 rounded-lg hover:border-N200 transition-colors"
          >
            <ArrowLeft size={14} /> Go back
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium border border-N40 text-N700 rounded-lg hover:border-N200 transition-colors"
          >
            <Home size={14} /> Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
