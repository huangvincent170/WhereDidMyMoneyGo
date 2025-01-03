
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
    return <nav className="navMenu">
        <ul>
            <li className="navTitle">Where Did My Money Go</li>
            {SidebarData.map((item, index) => {
                return <li key={index} className="navText">
                    <Link to={item.path}>
                        {item.icon}
                        <span>{item.title}</span>
                    </Link>
                </li>;
            })}
        </ul>
    </nav>
}