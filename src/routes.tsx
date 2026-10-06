import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Ministries from "./pages/Ministries";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import GetInvolved from "./pages/GetInvolved";
import Cooperative from "./pages/Cooperative";
import CooperativeInterest from "./pages/CooperativeInterest";
import Give from "./pages/Give";
import PlanYourVisit from "./pages/PlanYourVisit";
import Contact from "./pages/Contact";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/ministries", element: <Ministries /> },
      { path: "/events", element: <Events /> },
      { path: "/events/:slug", element: <EventDetails /> },
      { path: "/get-involved", element: <GetInvolved /> },
      { path: "/cooperative", element: <Cooperative /> },
      {
        path: "/cooperative/interest",
        element: <CooperativeInterest />,
      },
      { path: "/give", element: <Give /> },
      { path: "/plan-your-visit", element: <PlanYourVisit /> },
      { path: "/contact", element: <Contact /> },
    ],
  },
]);
