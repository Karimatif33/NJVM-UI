import React from "react";

const ButtonType = ({
  onClick,
  children,
  className,
  isLoading,
  status,
  disabled,
}) => {
  // Determine the button class based on component state
  let buttonClass = "text-black dark:text-green-400 dark:hover:text-white";

  if (isLoading) {
    buttonClass += " text-orange-600 border-yellow-500 dark:text-orange-400 hover:bg-orange-500 "; // Yellow background for loading
  } else if (status === "Success") {
    buttonClass += " text-green-800 border-green-500 "; // Green background for success
  } else if (status === "Failed") {
    buttonClass += " text-red-600 border-red-500 dark:text-red-400 hover:bg-red-500  "; // Red background for failure
  } else {
    buttonClass += " text-green-600 border-green-500"; // Default orange background
  }

  buttonClass +=
    " m-4 bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border hover:border-transparent rounded hover:drop-shadow-xl";

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      type="button"
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ButtonType;
