import { ReactComponent as LogoDark } from "../assets/images/logos/materialpro.svg";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link className="text-light" style={{textDecoration:'none'}} to="/">
{/* <i  class="bi bi-house-fill"></i> */}
Business Entry
    </Link>
  );
};

export default Logo;
