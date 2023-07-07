import React from "react";
import './SidebarChat.css';
import { Avatar } from "@mui/material";

function SidebarChat(){
    return (
        <div className="sidebarChat">
            <Avatar />
            <div className="sidebarChat__info">
                <h2>Room Name</h2>
                <p>Ths is the last message</p>
            </div>
        </div>
    )
}

export default SidebarChat;