import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import { NavLink } from 'react-router-dom';

function Navbutton({route,isActive}) {
    
    const handleClick = function () {
        window.location.href = "/"+route;
    }

    let className = "navButton " + route;
    if(isActive) {
        className += " active";
    }
    return (
        <div className={className} onClick={handleClick}>{route.toUpperCase()}</div>
    )
}

function Navbar(props) {

    let url = window.location.href.slice(-1);
    let task = true;
    if(url === "m") {
        task = false;
    }
    return (
        <div className="topnav">
            <Navbutton route={`tasks`} isActive={task}/>
            <Navbutton route={`team`} isActive={!task}/>
        </div>
    );
}

function Navigation(props) {
    return (
        <header className="header">
            <Navbar />
            <div id="projectName">
                <h1>McDonalds Website Project</h1>
            </div>
        </header>
    );
}

export default Navigation;