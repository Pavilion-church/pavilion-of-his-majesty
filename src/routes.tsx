import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import AuthLayout from "./components/layout/auth/AuthLayout";
import MemberLayout from "./components/layout/auth/MemberLayout";
import ProtectedRoute from "./components/layout/auth/ProtectedRoute";

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

import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";

import MemberDashboard from "./pages/member/MemberDashboard";
import Profile from "./pages/member/Profile";
import Birthday from "./pages/member/Birthday";
import MemberCooperative from "./pages/member/Cooperative";

import AdminRoute from "./components/layout/auth/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./components/layout/Admin/AdminLayout";
import AdminBirthdays from "./pages/admin/AdminBirthdays";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminMembers from "./pages/admin/AdminMembers";
import AdminCooperative from "./pages/admin/AdminCooperative";

export const router = createBrowserRouter([
  /*
   * PUBLIC WEBSITE
   */
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/ministries",
        element: <Ministries />,
      },
      {
        path: "/events",
        element: <Events />,
      },
      {
        path: "/events/:slug",
        element: <EventDetails />,
      },
      {
        path: "/get-involved",
        element: <GetInvolved />,
      },
      {
        path: "/cooperative",
        element: <Cooperative />,
      },
      {
        path: "/give",
        element: <Give />,
      },
      {
        path: "/plan-your-visit",
        element: <PlanYourVisit />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
    ],
  },

  /*
   * AUTHENTICATION
   */
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmail />,
      },
    ],
  },

  /*
   * PROTECTED MEMBER AREA
   */
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MemberLayout />,
        children: [
          {
            path: "/member",
            element: <MemberDashboard />,
          },
          {
            path: "/member/profile",
            element: <Profile />,
          },
          {
            path: "/member/birthday",
            element: <Birthday />,
          },
          {
            path: "/member/cooperative",
            element: <MemberCooperative />,
          },
        ],
      },
    ],
  },

  /*
   * PROTECTED COOPERATIVE APPLICATION
   *
   * We will later add a membership/eligibility guard here.
   */
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/cooperative/interest",
        element: <CooperativeInterest />,
      },
    ],
  },

  // Admin Area

  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "/admin",
            element: <AdminDashboard />,
          },
          {
            path: "/admin/birthdays",
            element: <AdminBirthdays />,
          },
          {
            path: "/admin/messages",
            element: <AdminMessages />,
          },
          {
            path: "/admin/events",
            element: <AdminEvents />,
          },
          {
            path: "/admin/announcements",
            element: <AdminAnnouncements />,
          },
          {
            path: "/admin/members",
            element: <AdminMembers />,
          },
          {
            path: "/admin/cooperative",
            element: <AdminCooperative />,
          },
        ],
      },
    ],
  },
]);
