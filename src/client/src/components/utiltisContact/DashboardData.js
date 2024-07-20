import { IoIosTime } from "react-icons/io";
import { MdMoreTime } from "react-icons/md";
import { IoIosTimer } from "react-icons/io";
import { FaChartLine } from "react-icons/fa6";

export const EduData = [
  {
    icon: <FaChartLine />
    ,
    amount: "1.09",
    title: "Current GPA",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
    pcColor: "red-600",
  },
  {
    icon: <IoIosTimer />,
    amount: "69",
    title: "Requested Hours",
    iconColor: "rgb(255, 244, 229)",
    iconBg: "rgb(254, 201, 15)",
    pcColor: "green-600",
  },
  {
    icon: <IoIosTime />,
    amount: "34",
    // percentage: "+38%",
    title: "Earned Hours",
    iconColor: "rgb(228, 106, 118)",
    iconBg: "rgb(255, 244, 229)",

    pcColor: "green-600",
  },
  {
    icon: <MdMoreTime />,
    amount: "35",
    // percentage: "-12%",
    title: "Needed Hours",
    iconColor: "rgb(0, 194, 146)",
    iconBg: "rgb(235, 250, 242)",
    pcColor: "red-600",
  },
];
