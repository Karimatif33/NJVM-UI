import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../context/ContextProvider';
import { FaBook, FaConciergeBell } from 'react-icons/fa';

const Questionnaire = () => {
  const { DBUser } = useStateContext();
  const navigate = useNavigate();

  const navigateToCourses = () => {
    navigate('/courses-questionnaire');
  };

  const navigateToServices = () => {
    navigate('/services-questionnaire');
  };

  useEffect(() => {
    if (DBUser === null) {
      navigate("/dashboard");
    }
  }, [DBUser, navigate]);

  return (
    <div className="flex flex-col justify-center items-center mt-[40px] text-gray-800 dark:text-gray-100 p-4">
      <h1 className="text-4xl font-bold  bg-gray-400 p-4 rounded mb-6 cursor-pointer">Questionnaire</h1>
      <p className="mb-8 text-center text-xm font-bold ">
        -: من خلال هذا الاستبيان يمكن المشاركة فى تقييم العملية التدريسية، إن من شأن هذه المشاركة إمداد أصحاب القرار بالجامعة بالمعلومات الكافية لتصحيح أى خطأ أو قصور فى العملية التدريسية ومن الجدير بالذكر أن نشير إلى النقاط التالية<br /><br />
        إن إجاباتك عن هذه الاستبيانات سرية للغاية ولا يمكن لأحد بالجامعة الإطلاع عليها إلا من خلال حكم قضائى اذا لزم الأمر ؛ لذلك كان من الضروري المحافظة التامة على كلمة المرور الخاصة بك حتى لا يتمكن أحد من الإطلاع على آرائك الخاصة أو تعديلها<br />
        فقط يتم إستخدام إستبيانك للحصول على نتائج إحصائية عن كيفية سير العملية التدريسية<br />
        نظراً لأهمية الحصول على رأيك والذى نعتز به فإنه لن يتم إعلان نتيجتك على البورتال إلا بعد الإجابة على جميع الإستبيانات الخاصة بك<br />
        كما أنه يجب التحذير من أى تجاوزات فى التعليق على الإجابة باستخدام كلمات نابية أو خلافة سوف يعرضك للمسائلة القانونية
      </p>
      <div className="flex space-x-4">
        <button
          onClick={navigateToCourses}
          className="flex flex-col items-center px-6 py-7 bg-blue-500 dark:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 focus:ring-opacity-75"
        >
          <FaBook className="text-2xl mb-2" />
          <span>Courses</span>
          <div className="text-sm mt-1">See all courses questionnaire</div>
        </button>
        <button
          onClick={navigateToServices}
          className="flex flex-col items-center px-6 py-7 bg-green-500 dark:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 dark:hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 focus:ring-opacity-75"
        >
          <FaConciergeBell className="text-2xl mb-2" />
          <span>Services</span>
          <div className="text-sm mt-1">See all services questionnaire</div>
        </button>
      </div>
    </div>
  );
};

export default Questionnaire;
