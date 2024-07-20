import React from "react";

export const Button = ({bgColor, color, size, text,borderRadiuse}) => {
  return <button
  type="button"
  className={`text-white ${
    isLoading
      ? "text-yellow-500 border-yellow-500" // Yellow background for loading
      : status === "Success"
      ? "text-green-500 border-green-500" // Green background for success
      : status === "Failed"
      ? "text-red-500 border-red-500" // Red background for failure
      : "text-orange-300 border-orange-500" // Default orange background
  } m-4 bg-transparent hover:bg-orange-500 text-orange-700 font-semibold hover:text-white py-2 px-4 border hover:border-transparent rounded hover:drop-shadow-xl`}
  onClick={handlePullData}
  disabled={isLoading || !courseId}
>
  {isLoading ? "Loading..." : status ? status : "Pull"}
</button>;
};

export default Button;
