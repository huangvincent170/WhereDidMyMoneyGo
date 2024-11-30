
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
  return (
    <>
      <IconContext.Provider value={{ color: "undefined" }}>
        <nav className={"nav-menu"}>
          <ul className="nav-menu-items">
            <li className="nav-text">
              <b>Where Did My Money Go?</b>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className="nav-text">
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