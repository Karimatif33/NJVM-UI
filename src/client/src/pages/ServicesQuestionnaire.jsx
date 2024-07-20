import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

function ServicesQuestionnaire() {
  const { DBUser, user, devAutFill } = useStateContext();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [comments, setComments] = useState({});
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const navigate = useNavigate();

  // Fetch categories and questions from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, questionsResponse] = await Promise.all([
          axios.get("https://njmc.horus.edu.eg/api/hue/portal/v1/CatQuesServData"),
          axios.get("https://njmc.horus.edu.eg/api/hue/portal/v1/QuestionsData"),
        ]);

        const categories = categoryResponse.data.filter(
          (category) => category.type === "service"
        );
        const questions = questionsResponse.data;

        const grouped = {};

        categories.forEach((category) => {
          // Filter questions based on the category ID and type "service"
          const filteredQuestions = questions.filter(
            (question) => question.question_type === category.id
          );

          if (filteredQuestions.length > 0) {
            grouped[category.id] = {
              name: category.name,
              type: category.type,
              questions: filteredQuestions.map((question) => ({
                ...question,
                options: ["أوافق", "إلي حد ما", "لا أوافق"],
              })),
            };
          }
        });

        setGroupedQuestions(grouped);
        console.log(grouped);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (DBUser === null) {
      navigate("/dashboard");
    }
  }, [DBUser, navigate]);

  useEffect(() => {
    const allAnswered =
      Object.keys(selectedOptions).length ===
      Object.keys(groupedQuestions).reduce(
        (acc, categoryId) =>
          acc + groupedQuestions[categoryId].questions.length,
        0
      );

    setSubmitEnabled(allAnswered);
  }, [selectedOptions, groupedQuestions]);

  const handleRadioChange = (questionId, value) => {
    setSelectedOptions((prevSelected) => ({
      ...prevSelected,
      [questionId]: value,
    }));
  };

  const handleCommentChange = (categoryId, value) => {
    setComments((prevComments) => ({
      ...prevComments,
      [categoryId]: value,
    }));
  };

  const handleSubmit = () => {
    const data = {
      selectedOptions,
      comments,
      subjectId: selectedSubject?.id,
      userDB: DBUser,
      userCode: Number(user),
    };
    console.log("Submitting service questionnaire...", data);
    axios
      .post("https://njmc.horus.edu.eg/api/hue/portal/v1/SubmitQuestions", data)
      .then((response) => {
        console.log("Response:", response.data);
        // Reset state or navigate to next step after submission
      })
      .catch((error) =>
        console.error("Error submitting questionnaire:", error)
      );
  };

  return (
    <div className="flex flex-col items-center min-h-screen text-gray-800 dark:text-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Services Questionnaire</h1>
      <button
        onClick={() => navigate("/courses-questionnaire")}
        className="px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 focus:ring-opacity-75 mb-4"
      >
        Go to Courses Questionnaire
      </button>

      <div className="w-full max-w-5xl">
        <h2 className="text-xl font-bold mb-4">Service Questions</h2>
        {Object.keys(groupedQuestions).map((categoryId) => (
          <div
            key={categoryId}
            className="mb-6 bg-gray-100 p-8 rounded-2xl w-full wid dark:text-gray-200 dark:bg-secondary-dark-bg"
          >
            <h3 className="text-2xl font-semibold my-6 text-right">
              {groupedQuestions[categoryId].name}
            </h3>
            <hr />
            {groupedQuestions[categoryId].questions.map((question) => (
              <div
                key={question.id}
                className="dark:bg-[#4d525e4f] mb-4 mt-2 bg-gray-200 py-5 rounded-2xl flex justify-between align-middle px-5"
              >
                <div className="flex space-x-2 justify-center mt-2 wid80hun w-[50%]">
                  {question.options.map((option, index) => (
                    <div
                      key={`${question.id}_${index}`}
                      className="flex items-center"
                    >
                      <input
                        type="radio"
                        id={`${option}_${question.id}`}
                        name={`opinion_${question.id}`}
                        value={option}
                        checked={selectedOptions[question.id] === option}
                        onChange={() => handleRadioChange(question.id, option)}
                        className={`mr-2 ${devAutFill}`}
                        />
                      <label
                        htmlFor={`${option}_${question.id}`}
                        className={`px-4 py-2 rounded-lg cursor-pointer ${
                          selectedOptions[question.id] === option
                            ? "bg-blue-500 text-white" // Active style for selected option
                            : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                        } qusbox`}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="my-2 text-center textpx">
                  {question.description}
                </p>
              </div>
            ))}
            <div className="mt-4">
              <label
                htmlFor={`comment_${categoryId}`}
                className="block mb-2 font-semibold"
              >
                Write a comment for {groupedQuestions[categoryId].name}
              </label>
              <textarea
                id={`comment_${categoryId}`}
                value={comments[categoryId] || ""}
                onChange={(e) =>
                  handleCommentChange(categoryId, e.target.value)
                }
                className="dark:text-gray-200 dark:bg-[#424349] w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 focus:ring-opacity-75"
                rows="3"
              />
            </div>
          </div>
        ))}
        <button
          onClick={handleSubmit}
          disabled={!submitEnabled}
          className={`mt-4 px-4 py-2 font-semibold rounded-lg shadow-md ${
            submitEnabled
              ? "bg-green-500 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-900"
              : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
          } text-white focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 focus:ring-opacity-75`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default ServicesQuestionnaire;
