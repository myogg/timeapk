import { HomeIcon, PlusCircle, BarChart3, Calendar, Info } from "lucide-react";
import Index from "./pages/Index.jsx";
import DailyRecord from "./pages/DailyRecord.jsx";
import MonthlyReport from "./pages/MonthlyReport.jsx";
import DailyStats from "./pages/DailyStats.jsx";
import About from "./pages/About.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "首页",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "工作记录",
    to: "/daily",
    icon: <PlusCircle className="h-4 w-4" />,
    page: <DailyRecord />,
  },
  {
    title: "日统计",
    to: "/daily-stats",
    icon: <Calendar className="h-4 w-4" />,
    page: <DailyStats />,
  },
  {
    title: "月统计",
    to: "/monthly",
    icon: <BarChart3 className="h-4 w-4" />,
    page: <MonthlyReport />,
  },
  {
    title: "关于",
    to: "/about",
    icon: <Info className="h-4 w-4" />,
    page: <About />,
  },
];
