const QuestionnaireForm = ({ groupedQuestions, selectedOptions, comments, handleRadioChange, handleCommentChange, handleSubmit, submitEnabled }) => {
    return (
      <div>
        {Object.entries(groupedQuestions).map(([categoryId, category]) => (
          <div key={categoryId} className="mb-8">
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              {category.name}
            </h3>
            {category.questions.map((question) => (
              <div key={question.id} className="mb-4">
                <p className="text-gray-700 dark:text-gray-300 mb-2">{question.text}</p>
                {question.options.map((option) => (
                  <label key={option.id} className="block">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.id}
                      checked={selectedOptions[question.id] === option.id}
                      onChange={() => handleRadioChange(question.id, option.id)}
                      className="mr-2"
                    />
                    {option.text}
                  </label>
                ))}
              </div>
            ))}
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">
                Additional Comments:
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded"
                value={comments[categoryId] || ""}
                onChange={(e) => handleCommentChange(categoryId, e.target.value)}
              ></textarea>
            </div>
          </div>
        ))}
        <button
          onClick={handleSubmit}
          disabled={!submitEnabled}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    );
  };
  
  export default QuestionnaireForm;
  