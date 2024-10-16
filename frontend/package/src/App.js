import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { lazy } from "react";

/****Layouts*****/
const FullLayout = lazy(() => import("./layouts/FullLayout.js"));

/***** Pages *****/
const Starter = lazy(() => import("./views/Starter.js"));
const About = lazy(() => import("./views/About.js"));
const Alerts = lazy(() => import("./views/ui/Alerts"));
const Badges = lazy(() => import("./views/ui/Badges"));
const Buttons = lazy(() => import("./views/ui/Buttons"));
const Cards = lazy(() => import("./views/ui/Cards"));
const Grid = lazy(() => import("./views/ui/Grid"));
const Tables = lazy(() => import("./views/ui/Tables"));
const Forms = lazy(() => import("./views/ui/Forms"));
const BusinessEntry = lazy(() => import("./views/BusinessEntry.js"));
const Reports = lazy(() => import("./views/Reports.js"));
const Breadcrumbs = lazy(() => import("./views/ui/Breadcrumbs"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <><FullLayout children={<BusinessEntry />} /></>,
 
  },
  {
    path: "/businessEntry",
    element: <><FullLayout children={<BusinessEntry />} /></>,
 
  },
  {
    path: "/businessEntryReports",
    element: <><FullLayout children={<Reports />} /></>,
 
  },


]);

const App = () => {
  return (
    <div className="App">
      <RouterProvider router={router} /> {/* Only 1 RouterProvider here */}
    </div>
  );
};

export default App;
