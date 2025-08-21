import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; 
const SidebarIcon = ({ d }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d={d}></path>
  </svg>
);

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">MyApp</div>
       
      </div>
       <div style={{
        textAlign: "center",
        marginTop:"17px",
        paddingBottom: "17px",
        borderBottom: "1px solid #e9ecef",
        fontWeight: "600",
        fontSize: "20px"
        
       }}>Admin Pannel</div>
      
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/admin/users">
            <SidebarIcon d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            <span>All Users</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/articles">
            <SidebarIcon d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            <span>All Articles</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
