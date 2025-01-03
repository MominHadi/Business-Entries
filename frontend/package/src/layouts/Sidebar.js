import { Button, Nav, NavItem } from "reactstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import user1 from "../assets/images/users/user4.jpg";
import probg from "../assets/images/bg/download.jpg";

const navigation = [
  // {
  //   title: "Dashboard",
  //   href: "/starter",
  //   icon: "bi bi-speedometer2",
  // },
  // {
  //   title: "Alert",
  //   href: "/alerts",
  //   icon: "bi bi-bell",
  // },
  // {
  //   title: "Badges",
  //   href: "/badges",
  //   icon: "bi bi-patch-check",
  // },
  // {
  //   title: "Buttons",
  //   href: "/buttons",
  //   icon: "bi bi-hdd-stack",
  // },
  // {
  //   title: "Cards",
  //   href: "/cards",
  //   icon: "bi bi-card-text",
  // },
  // {
  //   title: "Grid",
  //   href: "/grid",
  //   icon: "bi bi-columns",
  // },
  // {
  //   title: "Table",
  //   href: "/table",
  //   icon: "bi bi-layout-split",
  // },
  // {
  //   title: "Forms",
  //   href: "/forms",
  //   icon: "bi bi-textarea-resize",
  // },
  // {
  //   title: "Breadcrumbs",
  //   href: "/breadcrumbs",
  //   icon: "bi bi-link",
  // },
  // {
  //   title: "About",
  //   href: "/about",
  //   icon: "bi bi-people",
  // },
  {
    title: "Business Entry",
    href: "/businessEntry", // Updated
    icon: "bi bi-briefcase-fill",
  },
  {
    title: "Reports",
    href: "/businessEntryReports", // Updated
    icon: "bi bi-card-list",
  },
];

const Sidebar = () => {
  const navigate = useNavigate()
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  let location = useLocation();
  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated'); // Clear authentication flag
    localStorage.removeItem('lastLoginTime'); // Optionally clear last login time
    navigate('/login'); // Redirect to login page
  };

  return (
    <div>
      <div className="d-flex align-items-center"></div>
      {/* <div
        className="profilebg"
        style={{ background: `url(${probg}) no-repeat` }}
      >
        <div className="p-3 d-flex">
          <img src={user1} alt="user" width="50" className="rounded-circle" />
          <Button
            color="white"
            className="ms-auto text-white d-lg-none"
            onClick={() => showMobilemenu()}
          >
            <i className="bi bi-x"></i>
          </Button>
        </div>
        <div className="bg-dark text-white p-2 opacity-75">Steave Rojer</div>
      </div> */}
      <div className="d-flex align-items-right">
        <Button
          color="white"
          className="ms-auto text-dark d-lg-none"
          style={{ backgroundColor: "transparent", border: "none", fontSize: "20px" }} // Ensure it's visible
          onClick={() => showMobilemenu()}
        >
          <i className="bi bi-x-circle"></i>
        </Button>

      </div>
      <div className="p-3 mt-2">
        <Nav vertical className="sidebarNav">

          {navigation.map((navi, index) => (
            <NavItem key={index} className="sidenav-bg">
              <Link
                to={navi.href}
                className={
                  location.pathname === navi.href
                    ? "active nav-link py-3"
                    : "nav-link text-secondary py-3"
                }
              >
                <i className={navi.icon}></i>
                <span className="ms-3 d-inline-block">{navi.title}</span>
              </Link>
            </NavItem>
          ))}
            <NavItem className="sidenav-bg">
            <Button
              color="transparent" // Keep background transparent
              className="nav-link text-secondary py-3" // Apply similar styles
              onClick={handleLogout} // Call logout function
            >
              <i className="bi bi-box-arrow-right"></i> {/* Icon for logout */}
              <span className="ms-3">Logout</span>
            </Button>
          </NavItem>
       
          {/* <Button
            color="danger"
            tag="a"
            target="_blank"
            className="mt-3"
            href="https://wrappixel.com/templates/materialpro-react-admin/?ref=33"
          >
            Upgrade To Pro
          </Button> */}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
