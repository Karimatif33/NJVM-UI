import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import { useEffect } from "react";
import HUELogoMainSidebar from '../utiltis/IMG/HUE.png'; // Adjust the path as necessary

function Unauthorized() {
  const { user } = useStateContext();
  const navigate = useNavigate();


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-main-dark-bg">
      <div className="text-center p-8 bg-white dark:bg-secondary-dark-bg shadow-lg rounded-lg">
        <UnauthorizedIcon className="w-16 h-16 mx-auto mb-4 text-red-500 dark:text-red-400" />
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Unauthorized</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">You do not have access to this page. <br />Please contact your Admin!</p>
        {/* <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          Go to Home
        </button> */}
      </div>
    </div>
  );
}

function UnauthorizedIcon({ className }) {
  return (
    
              <img src={HUELogoMainSidebar} alt="HUE" />
              
  );
}

export default Unauthorized;
