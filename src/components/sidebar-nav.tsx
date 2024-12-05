
import { FaCartShopping } from "react-icons/fa6";
import { BsBank2, BsGraphUp } from "react-icons/bs";
import { TbTransactionDollar, TbCategory } from "react-icons/tb";
import { Link } from "react-router-dom";

const SidebarData = [
    {
        title: "Transactions",
        path: "/",
        icon: <FaCartShopping />
    },
    {
        title: "Sources",
        path: "/sources",
        icon: <BsBank2 />
    },
    {
        title: "Categories",
        path: "/categories",
        icon: <TbCategory />
    },
    {
        title: "Rules",
        path: "/rules",
        icon: <TbTransactionDollar />
    },
    {
        title: "Analytics",
        path: "/analytics",
        icon: <BsGraphUp />
    },
];


export function SidebarNav() {
    return <nav className="nav-menu">
        <ul className="nav-menu-items">
            <li className="nav-title">
                <b>Where Did My Money Go</b>
            </li>
            {SidebarData.map((item, index) => {
                return <li key={index} className="nav-text">
                    <Link to={item.path}>
                        {item.icon}
                        <span>{item.title}</span>
                    </Link>
                </li>;
            })}
        </ul>
    </nav>
}