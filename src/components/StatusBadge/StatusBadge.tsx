import React from "react";

type StatusBadgeProps = {
  value: string;
  successValue?: string;
};

const StatusBadge = ({ value, successValue = "Success" }: StatusBadgeProps) => {
  const isSuccess = value === successValue;

  return (
    <span
      className={`px-7 py-4 border-4 ml-4 font-bold rounded-2xl text-h-xs ${
        isSuccess
          ? "bg-green-100 text-green-700 border-green-500"
          : "bg-gray-50 text-red-700 border-red-500"
      }`}
    >
      <span
        className={`inline-block w-2 h-2 mr-2 rounded-full ${
          isSuccess ? "bg-green-500" : "bg-red-500"
        }`}
      />
      {value}
    </span>
  );
};

export default StatusBadge;
