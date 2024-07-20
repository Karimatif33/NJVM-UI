import React, { useState } from "react";
import { useStateContext } from "../context/ContextProvider";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const InputForm = () => {
  const navigate = useNavigate();
  const { setUser, currentcolor, user, activeMenu, screenSize, setActiveMenu} = useStateContext();
  const [inputValue, setInputValue] = useState("");
  // console.log(setUser, inputValue, setInputValue);
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };
  // const storedId = localStorage.getItem("StudentCode");
  // if (storedId) {
  //   setUser(storedId);}
  const handleSetUserId = () => {
    const trimmedValue = inputValue.trim(); // Trim leading and trailing spaces
    if (trimmedValue !== "") {
    }

    // Validate the input if needed
    if (inputValue.length === 7) {
      const inputValueAsNumber = parseInt(inputValue, 10);

      if (!isNaN(inputValueAsNumber) && user !== inputValueAsNumber) {
        setUser(inputValueAsNumber);
        localStorage.setItem("StudentCode", inputValueAsNumber);
        toast.success(`Logged in as ${inputValueAsNumber}`);
        navigate("/Dashboard");
        handleCloseSideBar()
      }
    } else {
      toast.error("Invalid Student ID");
    }
  };
  // console.log(handleSetUserId);
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    handleSetUserId(); // Call your function to handle user ID when the form is submitted
  };
  return (
    <form onSubmit={handleSubmit} class="w-full max-w-sm  mt-7">
      <div class={`flex items-center border-b border-[${currentcolor}] py-2`}>
        <input
          class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none dark:text-white"
          id="studentId"
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter Student ID"
          min="0"
        />

        <button
          style={{ background: currentcolor }}
          onClick={handleSetUserId}
          class={`flex-shrink-0  hover:bg-[#eeedea]   hover:border-[#f0dfb4]  text-sm mr-3 text-white py-1 px-2 rounded mr-2" type="button`}
        >
          Log In
        </button>
      </div>
    </form>
  );
};

export default InputForm;
