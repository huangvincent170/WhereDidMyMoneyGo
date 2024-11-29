
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { useState } from "react";
import { Link } from "react-router-dom";
import { IconContext } from "react-icons";

const SidebarData = [
  {
    title: "Transactions",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Sources",
    path: "/sources",
    icon: <FaIcons.FaCartPlus />,
    cName: "nav-text",
  },
];


export default function SidebarNav() {
  const [sidebarShown, setSidebarShown] = useState(false);
  return (
    <>
      <IconContext.Provider value={{ color: "undefined" }}>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={() => setSidebarShown(!sidebarShown)} />
          </Link>
        </div>
        <nav className={sidebarShown ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={() => setSidebarShown(!sidebarShown)}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}