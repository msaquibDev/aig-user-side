import React from "react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-blue-500 font-medium"></span>
    </div>
  );
}
