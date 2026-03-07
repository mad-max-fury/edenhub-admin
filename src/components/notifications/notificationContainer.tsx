"use client";

import { ToastContainer } from "react-toastify";
import { X } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const CloseButton = ({ closeToast }: { closeToast: any }) => (
  <button
    onClick={closeToast}
    className="absolute top-4 right-4 text-[var(--color-N80)] hover:text-[var(--color-N500)] transition-colors"
    aria-label="close"
  >
    <X size={18} strokeWidth={2.5} />
  </button>
);

function NotificationContainer() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      closeButton={CloseButton}
      toastClassName="relative flex items-center overflow-hidden cursor-pointer"
    />
  );
}

export default NotificationContainer;
