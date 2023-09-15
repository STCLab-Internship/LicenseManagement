import React from "react";
import { SidebarData } from './SidebarData';
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";

function Sidebar(){

return(
    <>

    <nav className='nav-menu active'>
    <ul className='nav-menu-items'>
      <li className='navbar-toggle'>
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

      </>
)
}
export default Sidebar;