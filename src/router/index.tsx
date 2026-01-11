import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { PageLoader } from "@/components";

const RouterProviderWrapper = () => {
  return <RouterProvider router={router} fallbackElement={<PageLoader />} />;
};

export default RouterProviderWrapper;
