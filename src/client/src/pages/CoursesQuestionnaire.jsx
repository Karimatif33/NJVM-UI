import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import { IoMdCheckmarkCircle } from "react-icons/io";
import Spinner from "../components/Spinner";
const CoursesQuestionnaire = () => {
  const { DBUser, user, devAutFill } = useStateContext();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [view, setView] = useState("course"); // 'course' or 'instructors'
  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [instructors, setInstructors] = useState([]);
  const [activeInstructorIndex, setActiveInstructorIndex] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedOptionsInstructor, setSelectedOptionsInstructor] = useState(
    {}
  );
  const [comments, setComments] = useState({});
  const [commentsInstructor, setCommentsInstructor] = useState({});
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [answeredInstructorsData, setAnsweredInstructorsData] = useState([]);
  const [answeredSubjectData, setAnsweredSubjectData] = useState([]);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [isAllInstructorsAnswered, setIsAllInstructorsAnswered] =
    useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Add a new state to trigger re-renders
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allInstructorsAnswered, setAllInstructorsAnswered] = useState(false);
  const [allSubjectsAnswered, setAllSubjectsAnswered] = useState(false);
  const [mappedSubjects, setMappedSubjects] = useState([]);
  const [activeSubjectIndex, setActiveSubjectIndex] = useState(null);
  const [courseButtonDisabled, setCourseButtonDisabled] = useState(false);
  const [showMessage, setShowMessage] = useState(false); // New state for showing message
    const initialFetchDone = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://njmc.horus.edu.eg/api/hue/portal/v1/Qus-CheckInstractorsExs/${DBUser}`
        );
        // console.log('Fetched data:', response.data);
        setAnsweredInstructorsData(response.data);

        // Find the first unanswered instructor
        const firstUnansweredIndex = response.data.findIndex(
          (instructor) => !instructor.answered
        );
        if (firstUnansweredIndex !== -1) {
          setActiveInstructorIndex(firstUnansweredIndex);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    // console.log('Fetch trigger changed:', fetchTrigger);
  }, [DBUser, fetchTrigger]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://njmc.horus.edu.eg/api/hue/portal/v1/Qus-CheckSubjectsExs/${DBUser}`
        );
        console.log("Fetched data CheckSubjectsExs :", response.data);
        setAnsweredSubjectData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    console.log("Fetch trigger changed:", fetchTrigger);
  }, [DBUser, fetchTrigger]);

  // console.log(answeredSubjectData, "AnsweredSubjectData")

  useEffect(() => {
    axios
      .get(`https://njmc.horus.edu.eg/api/hue/portal/v1/Qus-Stu/${DBUser}`)
      .then((response) => setSubjects(response.data))
      .catch((error) => console.error("Error fetching subjects:", error));
    // console.log('Fetch trigger changed:', fetchTrigger);
  }, [DBUser, fetchTrigger]);

  useEffect(() => {
    axios
      .get(`https://njmc.horus.edu.eg/api/hue/portal/v1/CatQuesServData`)
      .then((categoryResponse) => {
        axios
          .get(`https://njmc.horus.edu.eg/api/hue/portal/v1/QuestionsData`)
          .then((questionsResponse) => {
            const categories = categoryResponse.data;
            const questions = questionsResponse.data;

            const grouped = categories.reduce((acc, category) => {
              if (
                (view === "course" && category.type === "subject") ||
                (view === "instructors" &&
                  (category.type === "assistant" || category.type === "doctor"))
              ) {
                acc[category.id] = {
                  name: category.name,
                  type: category.type,
                  questions: [],
                };
              }
              return acc;
            }, {});

            questions.forEach((question) => {
              if (grouped[question.question_type]) {
                grouped[question.question_type].questions.push({
                  ...question,
                  options: [
                    { id: 1, text: "أوافق" },
                    { id: 2, text: "إلى حد ما" },
                    { id: 3, text: "لا أوافق" },
                  ],
                });
              }
            });

            setGroupedQuestions(grouped);
            // console.log(groupedQuestions,"a ");
          })
          .catch((error) => console.error("Error fetching questions:", error));
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, [view]);

  useEffect(() => {
    if (DBUser === null) {
      navigate("/dashboard");
    }
  }, [DBUser, navigate]);

  const checkIfSubjectAnswered = (subjectId) => {
    return answeredSubjectData.some(
      (answered) => answered.subjectid === subjectId
    );
  };

  const fetchSubjects = () => {
    if (subjects.length === 0) {
      console.warn("No subjects found");
      return;
    }

    const mappedSubjects = subjects.map((subject) => ({
      id: subject.subjectid,
      name: subject.name,
      answered: checkIfSubjectAnswered(subject.subjectid),
    }));

    setMappedSubjects(mappedSubjects);

    const firstSubject = mappedSubjects[0];
    if (firstSubject) {
      setActiveSubjectIndex(firstSubject.id);
    } else {
      console.warn("No subjects found");
      setActiveSubjectIndex(null);
    }

    console.log(mappedSubjects, "mappedSubjects");
  };

  const fetchInstructors = (subjectId) => {
    const subject = subjects.find((subject) => subject.subjectid === subjectId);
    if (subject) {
      // Use a Set to track unique instructor IDs
      const uniqueInstructors = new Map();

      subject.instructors.forEach((instructor) => {
        if (!uniqueInstructors.has(instructor.Id)) {
          uniqueInstructors.set(instructor.Id, {
            id: instructor.Id,
            name: instructor.Name,
            answered: checkIfInstructorAnswered(subjectId, instructor.Id),
          });
        }
      });

      const mappedInstructors = Array.from(uniqueInstructors.values());

      setInstructors(mappedInstructors); // Update state with mapped instructors

      // Set the active instructor index to the ID of the first instructor by default
      const firstInstructor = mappedInstructors[0];
      if (firstInstructor) {
        setActiveInstructorIndex(firstInstructor.id);
      } else {
        console.warn(`No instructors found for subject with id ${subjectId}`);
        setActiveInstructorIndex(null); // Optionally set to null or handle accordingly
      }

      console.log(mappedInstructors, "mappedInstructors");
    } else {
      console.error(`Subject with id ${subjectId} not found`);
    }
  };

  // Function to check if an instructor is answered
  const checkIfInstructorAnswered = (subjectId, instructorId) => {
    return answeredInstructorsData.some(
      (instructor) =>
        instructor.subjectid === subjectId &&
        instructor.instructorid === instructorId
    );
  };

  // Function to check if all instructors in a subject are answered

  // console.log(activeInstructorIndex)
  const handleRadioChange = (questionId, value) => {
    setSelectedOptions((prevSelected) => ({
      ...prevSelected,
      [questionId]: value,
    }));
    const allAnswered = Object.values(groupedQuestions).every((group) =>
      group.questions.every((question) => selectedOptions[question.id])
    );
    setSubmitEnabled(allAnswered);
  };

  const handleRadioChangeInstructor = (questionId, value) => {
    setSelectedOptionsInstructor((prevSelected) => ({
      ...prevSelected,
      [questionId]: value,
    }));

    const allAnswered = Object.values(groupedQuestions).every((group) =>
      group.questions.every(
        (question) => selectedOptionsInstructor[question.id]
      )
    );
    setSubmitEnabled(allAnswered);
  };

  const handleCommentChange = (categoryId, value) => {
    setComments((prevComments) => ({
      ...prevComments,
      [categoryId]: value,
    }));
  };

  const handleCommentChangeInstructor = (categoryId, value) => {
    setCommentsInstructor((prevComments) => ({
      ...prevComments,
      [categoryId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (checkIfSubjectAnswered(selectedSubject.subjectid)) {
      setShowMessage(true);
      return;
    }
    
    setShowMessage(false); // Hide the message if subject is not answered
    const formattedOptions = [];
    Object.keys(selectedOptions).forEach((questionId) => {
      let optionValue = selectedOptions[questionId];
      console.log(questionId, "e");
  
      if (
        typeof optionValue === 'object' &&
        optionValue !== null &&
        optionValue.hasOwnProperty('id') &&
        optionValue.hasOwnProperty('text')
      ) {
        const optionId = optionValue.id; // ID part
        const optionText = optionValue.text; // Text part
        const qusId = Number(questionId);
        formattedOptions.push({
          qusId,
          id: optionId,
          text: optionText,
        });
      } else {
        console.error(`Invalid option value format for question ID ${questionId}: ${optionValue}`);
      }
    });
  
    console.log(formattedOptions);
    const data = {
      selectedOptions: formattedOptions,
      comments,
      type: "course",
      subjectId: selectedSubject.subjectid,
      courseid: selectedSubject.courseid,
      userDB: DBUser,
      userCode: Number(user),
    };
    console.log("Submitting course questionnaire...", data);
  
    try {
      const response = await axios.post(
        "https://njmc.horus.edu.eg/api/hue/portal/v1/SubmitQuestions",
        data
      );
  
      console.log("Response:", response.data);
  
      // Update the subject state to marked as answered
      const updatedSubjects = subjects.map((subject) =>
        subject.subjectid === selectedSubject.subjectid
          ? { ...subject, answered: true }
          : subject
      );
      setSubjects(updatedSubjects);
  
      // Disable the course button
      setCourseButtonDisabled(true);
      setFetchTrigger((prev) => !prev);
      // Navigate to the instructors view
      setView("instructors");
  
      const subjectInstructors = instructors.filter(
        (instructor) => instructor.subjectId === selectedSubject.subjectid
      );
  
      if (subjectInstructors.length > 0) {
        const allInstructorsAnswered = subjectInstructors.every(
          (instructor) => instructor.answered
        );
  
        if (allInstructorsAnswered) {
          const nextSubject = updatedSubjects.find(
            (subject) => !subject.answered
          );
  
          if (nextSubject) {
            setSelectedSubject(nextSubject);
            setView("course"); // Go back to course view
          } else {
            console.log("All subjects have been answered.");
          }
        } else {
          const firstUnansweredInstructor = subjectInstructors.find(
            (instructor) => !instructor.answered
          );
          if (firstUnansweredInstructor) {
            setActiveInstructorIndex(firstUnansweredInstructor.id);
            clearSelectedOptions();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
      }
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);
      setError("Failed to submit the questionnaire. Please try again later.");
    }
  };
  
  
  const handleSubmitInstructor = async () => {
    const formattedOptions = [];

    Object.keys(selectedOptionsInstructor).forEach((questionId) => {
      let optionValue = selectedOptionsInstructor[questionId];
      if (
        typeof optionValue === "object" &&
        optionValue !== null &&
        optionValue.hasOwnProperty("id") &&
        optionValue.hasOwnProperty("text")
      ) {
        const optionId = optionValue.id;
        const optionText = optionValue.text;
        const qusId = Number(questionId);

        formattedOptions.push({
          qusId,
          id: optionId,
          text: optionText,
        });
      } else {
        console.error(
          `Invalid option value format for question ID ${questionId}: ${optionValue}`
        );
      }
    });

    const data = {
      selectedOptions: formattedOptions,
      comments: commentsInstructor,
      type: "instructors",
      subjectId: selectedSubject.subjectid,
      instructorId: activeInstructorIndex,
      courseid: selectedSubject.courseid,
      userDB: DBUser,
      userCode: Number(user),
    };

    console.log("Submitting instructor questionnaire...", data);

    try {
      await axios.post(
        "https://njmc.horus.edu.eg/api/hue/portal/v1/SubmitQuestions",
        data
      );

      const updatedInstructors = instructors.map((instructor) =>
        instructor.id === activeInstructorIndex
          ? { ...instructor, answered: true }
          : instructor
      );
      setInstructors(updatedInstructors);
      setFetchTrigger((prev) => !prev);

      // Find the next available instructor to automatically set as active
      const nextInstructor = updatedInstructors.find(
        (instructor) => !instructor.answered
      );

      if (nextInstructor) {
        setActiveInstructorIndex(nextInstructor.id);
        clearSelectedOptions();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setActiveInstructorIndex(null);
      }

      console.log("Questionnaire submitted successfully!");
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      if (error.response) {
        // The request was made and the server responded with a status code outside the 2xx range
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request data:", error.request);
      } else {
        // Something happened in setting up the request
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);

      setError("Failed to submit the questionnaire. Please try again later.");
    }
  };

  // useEffect(() => {
  //   // Effect to run when currentInstructorIndex changes
  //   console.log('Component re-rendered with index:', currentInstructorIndex);
  // }, [currentInstructorIndex]); // Dependency array to watch

  const clearSelectedOptions = () => {
    setSelectedOptionsInstructor({});
    setSelectedOptions({});
    setCommentsInstructor({});
    setComments({});
    setSubmitEnabled(false); // Reset submit button state
  };

  const handleSubjectClick = async (subject) => {
    setView("course");
    setSelectedSubject(subject);
    setActiveInstructorIndex(null); // Reset active instructor
    clearSelectedOptions();
    await fetchInstructors(subject.subjectid);
    const allAnswered = checkIfAllInstructorsAnswered(subject.subjectid);
    setAllInstructorsAnswered(allAnswered);
  };

  const handleInstructorClick = (index) => {
    if (!isAllInstructorsAnswered) {
      setActiveInstructorIndex(index);
      setView("instructors");
      clearSelectedOptions();
    }
  };
  useEffect(() => {
    // Find the first instructor that is not answered
    const firstNotAnsweredIndex = instructors.findIndex(
      (instructor) => !instructor.answered
    );

    // Set active instructor to the first not answered one, if found
    if (firstNotAnsweredIndex !== -1) {
      setActiveInstructorIndex(instructors[firstNotAnsweredIndex].id);
    }
  }, [instructors]);

  const checkIfAllInstructorsAnswered = () => {
    const answered = instructors.every((instructor) =>
      answeredInstructorsData.some(
        (answered) => answered.instructorid === instructor.id
      )
    );
    // console.log(answeredInstructorsData,"answeredInstructorsData")
    // console.log(instructors.id, "instructors")
    // console.log(answered,"answered")
    setAllInstructorsAnswered(answered);
  };

  // Effect to check if all instructors are answered on component mount
  useEffect(() => {
    if (instructors.length > 0 && answeredInstructorsData.length > 0) {
      checkIfAllInstructorsAnswered();
    }
  }, [instructors, answeredInstructorsData, subjects, handleSubjectClick]);

  // const allInstructorsAnswered = instructors.length > 0 && instructors.every(instructor => instructor.answered);

  useEffect(() => {
    if (!initialFetchDone.current && subjects.length > 0) {
      fetchSubjects();
      initialFetchDone.current = true;
    }
  }, [subjects, answeredSubjectData]);

  // useEffect(() => {
  //   if (mappedSubjects.length > 0 && answeredSubjectData.length > 0) {
  //     checkIfAllSubjectsAnswered();
  //     checkAndDisableButtons();
  //   }
  // }, [mappedSubjects, answeredSubjectData]);

  useEffect(() => {
    console.log("Subjects:", subjects);
    console.log("Answered Subjects Data:", answeredSubjectData);
  }, [subjects, answeredSubjectData]);

  return (
    <div className="flex flex-col items-center min-h-screen text-gray-800 dark:text-gray-100 p-4">
      {error && <p>{error}</p>}
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {" "}
          <h1 className="text-2xl font-bold mb-4">Courses Questionnaire</h1>
          <button
            onClick={() => navigate("/services-questionnaire")}
            className="px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 focus:ring-opacity-75 mb-4"
          >
            Go to Services Questionnaire
          </button>
          <div className="flex flex-wrap justify-center space-x-4 mb-8">
            {subjects.map((subject) => (
              <button
                key={subject.subjectid}
                onClick={() => handleSubjectClick(subject)}
                style={{
                  backgroundColor:
                    selectedSubject &&
                    selectedSubject.subjectid === subject.subjectid
                      ? "#3B82F6"
                      : "#6B7280", // Blue if active, gray otherwise
                  color:
                    selectedSubject &&
                    selectedSubject.subjectid === subject.subjectid
                      ? "#FFFFFF"
                      : "#F3F4F6", // White text if active, lighter gray otherwise
                }}
                className="px-4 py-2 m-2 font-semibold rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-opacity-75"
              >
                {subject.subjectName}
              </button>
            ))}
          </div>
          {selectedSubject && (
            <div className="w-full max-w-5xl">
            <div className="flex justify-center space-x-4 mb-4">
            <button
      onClick={() => setView("course")}
      className={`px-4 py-2 ${
        view === "course"
          ? "bg-blue-500 dark:bg-blue-700"
          : "bg-[#6B7280] dark:bg-gray-700"
      } text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 focus:ring-opacity-75`}
      style={{
        backgroundColor: checkIfSubjectAnswered(selectedSubject.subjectid)
          ? "#c2410c" // Orange if answered
          : (view === "course" ? "#3B82F6" : "#6B7280"), // Blue if active, gray otherwise
        cursor: checkIfSubjectAnswered(selectedSubject.subjectid)
          ? "not-allowed"
          : "pointer", // Pointer if not answered, not-allowed if answered
        opacity: checkIfSubjectAnswered(selectedSubject.subjectid) ? 0.5 : 1, // Reduced opacity if answered
      }}
      disabled={checkIfSubjectAnswered(selectedSubject.subjectid)} // Disable button if courseButtonDisabled or subject is answered
    >
      Course {checkIfSubjectAnswered(selectedSubject.subjectid) ? "(Answered)" : ""}
    </button>
                {!allInstructorsAnswered ? (
                  <button
                    onClick={() => {
                      setView("instructors");
                    }}
                    className={`px-4 py-2 ${
                      view === "instructors"
                        ? "bg-blue-500 dark:bg-blue-700"
                        : "bg-[#6B7280] dark:bg-gray-700"
                    } text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 focus:ring-opacity-75`}
                  >
                    Instructors
                  </button>
                ) : (
                  <button
                    className={`px-4 py-2 ${
                      view === "instructors"
                        ? "bg-blue-500 dark:bg-blue-700"
                        : "bg-orange-500 dark:bg-orange-700 cursor-not-allowed"
                    } text-white font-semibold rounded-lg shadow-md`}
                    style={{
                      cursor: "not-allowed",
                      opacity: 0.5,
                    }}
                    disabled
                  >
                    Instructors (Answered)
                  </button>
                )}
              </div>
              {view === "course" ? (
                <div>
                  <h2 className="text-xl font-bold mb-4">Course Questions</h2>
                  
                  {Object.entries(groupedQuestions).map(
                    ([headId, group]) =>
                      group.type === "subject" && (
                        <div
                          key={headId}
                          className="mb-6 bg-gray-100 p-8 rounded-2xl w-full wid dark:text-gray-200 dark:bg-secondary-dark-bg "
                        >
                          <h3 className="text-2xl font-semibold mb-2 text-right dark:text-gray-200 dark:bg-secondary-dark-bg ">
                            {group.name}
                          </h3>
                          <hr />
                          {group.questions.map((question) => (
                            <div
                              key={question.id}
                              className="mb-4 mt-2 bg-gray-200 py-5 rounded-2xl flex justify-between align-middle px-5 dark:text-gray-200 dark:bg-[#4d525e4f]"
                            >
                              <div className="flex space-x-2 justify-center mt-2 wid80hun w-[50%]">
                                {question.options.map((option) => (
                                  <div key={`${question.id}_${option.id}`}>
                                    <input
                                      type="radio"
                                      id={`${option.id}_${question.id}`}
                                      name={`opinion_${question.id}`}
                                      value={option.id} // Use option.id to ensure value is properly set
                                      checked={
                                        selectedOptions[question.id]?.id ===
                                        option.id
                                      } // Check if the selected option matches the current option's id
                                      onChange={() =>
                                        handleRadioChange(question.id, option)
                                      }
                                      className={`mr-2 ${devAutFill}`}
                                    />
                                    <label
                                      htmlFor={`${option.id}_${question.id}`}
                                      className={`px-4 py-2 rounded-lg cursor-pointer ${
                                        selectedOptions[question.id]?.id ===
                                        option.id
                                          ? "bg-blue-500 text-white" // Active style for selected option
                                          : "bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                                      } qusbox`}
                                    >
                                      {option.text}
                                    </label>
                                  </div>
                                ))}
                              </div>
                              <p className="mb-5 text-center textpx dark:text-gray-200">
                                {question.description}
                              </p>
                            </div>
                          ))}
                          <div className="mt-4">
                            <label
                              htmlFor={`comment_${headId}`}
                              className="block mb-2 font-semibold"
                            >
                              Write a comment
                            </label>
                            <textarea
                              id={`comment_${headId}`}
                              value={comments[headId] || ""}
                              onChange={(e) =>
                                handleCommentChange(headId, e.target.value)
                              }
                              className="dark:text-gray-200 dark:bg-[#424349] w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 focus:ring-opacity-75"
                              rows="3"
                            />
                          </div>
                        </div>
                      )
                  )}
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
              ) : (
                <div>
                  {isLoading && <p>Loading...</p>}
                  {error && <p>{error}</p>}
                  {allInstructorsAnswered ? (
                    <p>All instructors have already answered.</p>
                  ) : instructors.length > 0 ? (
                    <>
                      <div>
                        {instructors.map((instructor) => (
                          <button
                            key={instructor.id}
                            onClick={() => handleInstructorClick(instructor.id)}
                            className={`px-5 py-2 m-2 font-semibold rounded-lg shadow-md mb-5 ${
                              activeInstructorIndex === instructor.id
                                ? "bg-blue-500 dark:bg-blue-700 text-white"
                                : "bg-gray-400 dark:bg-gray-600 text-black dark:text-white"
                            } ${
                              instructor.answered
                                ? "bg-orange-500 dark:bg-orange-700 cursor-not-allowed"
                                : "hover:bg-blue-900 dark:hover:bg-blue-900"
                            } focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 focus:ring-opacity-75`}
                            disabled={instructor.answered}
                            style={{ position: "relative" }}
                          >
                            {instructor.answered
                              ? `(Answered) - ${instructor.name} `
                              : instructor.name}
                          </button>
                        ))}
                      </div>

                      {activeInstructorIndex !== null && (
                        <div>
                          {Object.entries(groupedQuestions).map(
                            ([headId, group]) =>
                              (group.type === "assistant" ||
                                group.type === "doctor") && (
                                <div
                                  key={headId}
                                  className="mb-6 bg-gray-100 p-8 rounded-2xl w-full wid dark:text-gray-200 dark:bg-secondary-dark-bg"
                                >
                                  <h3 className="text-2xl font-semibold mb-2 text-right">
                                    {group.name}
                                  </h3>
                                  <hr />
                                  {group.questions.map((question) => (
                                    <div
                                      key={question.id}
                                      className="mb-4 mt-2 bg-gray-200 py-5 rounded-2xl flex justify-between align-middle px-5 dark:text-gray-200 dark:bg-[#4d525e4f]"
                                    >
                                      <div className="flex space-x-2 justify-center mt-2 wid80hun w-[50%]">
                                        {question.options.map((option) => (
                                          <div
                                            key={`${question.id}_${option.id}`}
                                          >
                                            <input
                                              type="radio"
                                              id={`${option.id}_${question.id}`}
                                              name={`opinion_${question.id}`}
                                              value={option.id}
                                              checked={
                                                selectedOptionsInstructor[
                                                  question.id
                                                ]?.id === option.id
                                              }
                                              onChange={() =>
                                                handleRadioChangeInstructor(
                                                  question.id,
                                                  option
                                                )
                                              }
                                              className={`mr-2 ${devAutFill}`}
                                            />
                                            <label
                                              htmlFor={`${option.id}_${question.id}`}
                                              className={`px-4 py-2 rounded-lg cursor-pointer ${
                                                selectedOptionsInstructor[
                                                  question.id
                                                ]?.id === option.id
                                                  ? "bg-blue-500 text-white"
                                                  : "bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                                              } qusbox`}
                                            >
                                              {option.text}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                      <p className="mb-5 text-center textpx">
                                        {question.description}
                                      </p>
                                    </div>
                                  ))}
                                  <div className="mt-4">
                                    <label
                                      htmlFor={`comment_${headId}`}
                                      className="block mb-2 font-semibold"
                                    >
                                      Write a comment
                                    </label>
                                    <textarea
                                      id={`comment_${headId}`}
                                      value={commentsInstructor[headId] || ""}
                                      onChange={(e) =>
                                        handleCommentChangeInstructor(
                                          headId,
                                          e.target.value
                                        )
                                      }
                                      className="dark:text-gray-200 dark:bg-[#424349] w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 focus:ring-opacity-75"
                                      rows="3"
                                    />
                                  </div>
                                </div>
                              )
                          )}
                          <button
                            onClick={handleSubmitInstructor}
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
                      )}
                    </>
                  ) : (
                    answeredInstructorsData.length === 0 ||
                    (!isLoading && !error && <p>No data available.</p>)
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CoursesQuestionnaire;
