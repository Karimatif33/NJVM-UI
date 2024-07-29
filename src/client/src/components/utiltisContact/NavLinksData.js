import React from "react";

import { BsKanban } from "react-icons/bs";
import { IoMdContacts } from "react-icons/io";
import { RiContactsLine } from "react-icons/ri";
import { CgTranscript } from "react-icons/cg";
import { RxDashboard } from "react-icons/rx";
import { PiExam } from "react-icons/pi";
import { LuFileSpreadsheet } from "react-icons/lu";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { BsDatabaseAdd } from "react-icons/bs";
import { GiProgression } from "react-icons/gi";
import { MdOutlineAppRegistration } from "react-icons/md";
import { RiQuestionnaireFill } from "react-icons/ri";
import { BiSolidCustomize } from "react-icons/bi";
import { PiExamFill } from "react-icons/pi";
export const links = [
  {
    title: "CUSTOMIZATION",
    links: [
      {
        name: "Total",
        path: "Total",
        icon: <BsDatabaseAdd />,
      },

      {
        name: " By Student",
        path: "StudentPull",
        icon: <RiContactsLine />,
      },
      {
        name: " By Course",
        path: "CoursesPull",
        icon: <IoMdContacts />,
      },
      {
        name: "Customization",
        path: "Customization",
        icon: <BiSolidCustomize />,
      },
    ],
    
  },

  {
    title: "Portal",
    links: [
      {
        name: "Dashboard",
        path: "Dashboard",
        icon: <RxDashboard />,
      },
      {
        name: "Transcript",
        path: "Transcript",
        icon: <CgTranscript />,
      },
      {
        name: "Progress",
        path: "Progress",
        icon: <GiProgression />,
      },
      {
        name: "Study Timetable",
        path: "study-timetable",
        icon: <BsKanban />,
      },
      {
        name: "Exam Timetable",
        path: "exam-timetable",
        icon: <PiExam />,
      },
      {
        name: "Subject Result",
        path: "Subject-Result",
        icon: <PiExamFill />
      },
      {
        name: "Absence Sheet",
        path: "attendance",
        icon: <LuFileSpreadsheet />,
      },
      {
        name: "Unpaid Invoices ",
        path: "Unbaidinvoices",
        icon: <LiaFileInvoiceDollarSolid />,
      },
      {
        name: "Questionnaire",
        path: "Questionnaire",
        icon: <RiQuestionnaireFill />,
      },
      {
        name: "Registration ",
        path: "Registration",
        icon: <MdOutlineAppRegistration />,
      },
    ],
  },

];

export const links_Stu = [
  {
    title: "Portal",
    links: [
      {
        name: "Dashboard",
        path: "Dashboard",
        icon: <RxDashboard />,
      },
      {
        name: "Transcript",
        path: "Transcript",
        icon: <CgTranscript />,
      },
      {
        name: "Progress",
        path: "Progress",
        icon: <GiProgression />,
      },
      {
        name: "Study Timetable",
        path: "study-timetable",
        icon: <BsKanban />,
      },
      {
        name: "Exam Timetable",
        path: "exam-timetable",
        icon: <PiExam />,
      },
      {
        name: "Subject Result",
        path: "Subject-Result",
        icon: <PiExamFill />
      },
      {
        name: "Absence Sheet",
        path: "attendance",
        icon: <LuFileSpreadsheet />,
      },
      {
        name: "Unpaid Invoices ",
        path: "Unbaidinvoices",
        icon: <LiaFileInvoiceDollarSolid />,
      },
      {
        name: "Questionnaire",
        path: "Questionnaire",
        icon: <RiQuestionnaireFill />,
      },
      {
        name: "Registration ",
        path: "Registration",
        icon: <MdOutlineAppRegistration />,
      },
    ],
  },
];
