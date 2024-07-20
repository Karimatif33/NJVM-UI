import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/ContextProvider";
import Spinner from "../components/Spinner";
import { MdOutlinePayment } from "react-icons/md";
import { useNavigate } from "react-router-dom";


// 1191252
// 5221526
// 4221143
const Unbaidinvoices = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { DBUser, currentcolor } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (DBUser !== undefined) {
          const response = await fetch(
            `https://njmc.horus.edu.eg/api/hue/portal/v1/StuFeesData&student_id=${DBUser}`
          );
          const result = await response.json();

          if (Array.isArray(result)) {
            setData(result);
          } else {
            console.error("API response is not an array:", result);
          }
        } else {
          console.error("DBUser is undefined");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [DBUser]);
  useEffect(() => {
    if (DBUser === null) {
      navigate("/dashboard");
    }
  }, [DBUser, navigate]);

  
  return (
    // mt-8 mx-auto max-w-5xl grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 incoives sm:mt-[80px]
    <div className="flex flex-wrap justify-start gap-6 incoives mx-7 incoives max-w-[90%] " key={data.id}>
      {loading ? (
        <Spinner currentcolor={currentcolor} />
      ) : data && data.length > 0 ? (
        data.map((item) => (
          <div className="my-8 ">
            <div
              key={item?.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-2xl max-w-[400px] min-w-[400px]  dark:bg-gray-800 "
            >
              <div className="p-6 ">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center dark:text-gray-100 ">
                  {item?.name}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-100 ">
                  Invoice Number:{" "}
                  <span className="font-bold">{item.number}</span>
                </p>
                <div className="flex flex-wrap gap-6 mt-3">
                  <p className="text-sm text-gray-700 dark:text-gray-100 ">
                    State:{" "}
                    <span className="font-semibold bg-green-100 text-green-800 text-xs  me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 cursor-default">
                      {item?.state}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-100 ">
                    Due Date:{" "}
                    <span className="font-semibold bg-purple-100 text-purple-800 text-xs me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-purple-400 border border-purple-400 cursor-default">
                      {item?.date_due}
                    </span>
                  </p>
                </div>
                <div className="flex justify-center mt-6">
                  <p className="text-l font-bold bg-indigo-100 text-indigo-800  me-2 px-6 py-2.5 rounded dark:bg-gray-700 dark:text-indigo-400 border border-indigo-400 cursor-default shadow-xl">
                    {`${item.amount} ${item.currency}`}
                  </p>
                </div>
              </div>
              <div className="flex-grow"></div>{" "}
              {/* Ensures payment status at bottom */}
              <div className="bg-blue-100 text-blue-700 p-3 rounded-b-lg flex items-center cursor-pointer">
                <MdOutlinePayment className="mr-2" />
                <p className="text-sm font-semibold">Waiting for Payment</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-900 bg-white rounded-xl text-center shadow-md p-4 font-semibold text-lg max-w-[50vw] m-auto mt-[100px]">
          There are no unpaid invoices
        </p>
      )}
    </div>
  );
};

export default Unbaidinvoices;
