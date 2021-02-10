import React,{useEffect, useState, useCallback} from 'react';
import ReactDOM from 'react-dom';

const AddUserButton = React.memo(function({clickHandle}) {


    function clickCallback() {
        clickHandle({imageUrl : "https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png"});
    }

    return( 
        <div className="addUserContainer" onClick={clickCallback}>
            <div className="addUser">
                <i className="fa fa-user-plus" aria-hidden="true"></i>
            </div>
        </div>
    );
});

const UserImage = React.memo(function({src,userName}) {
    return (
        <div className="userImage">
            <img src = {src} alt={userName} height="100px" width="100px" />
        </div>
    );
})

const UserCard = React.memo(function({user,editClick}) {

    function hadnleClickCallback() {
        editClick(user);
    }
    
    return (
        <section className="flexItems">
            <div className="userEdit" onClick={hadnleClickCallback}>
                <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
            </div>
            <UserImage src={user.imageUrl} userName={user.name}/>

            <div className="userName">
                {user.name}
            </div>

            <div className="userDesignation">
                {user.designation}
            </div>
            <hr color='#404040' className="lineBreaks" />

            <div className="userInfo userLocation">
                <i className="fa fa-map-marker"></i> {`  ${user.location}`}
            </div>

            <div className="userInfo userMail">
                <i className="fa fa-envelope" aria-hidden="true"></i> {`  ${user.email}`}
            </div>

            <div className="userInfo userPhone">
                <i className="fa fa-phone" aria-hidden="true"></i> {` ${user.phone}`}
            </div>
        </section>
    );
});

function UserImageurl({imageUrl,handleImageChange,userName}) {

    const [userImageurl,setUserImageurl] = useState(imageUrl);

    function handleChange(e) {
        let uploadUrl = e.target.value;
        uploadUrl = uploadUrl.slice(12);
        uploadUrl = 'assets/' + uploadUrl;
        setUserImageurl(uploadUrl);
        handleImageChange(uploadUrl);
    }

    return (
        <div className="userImageOverlay">
            <label htmlFor="image-input">
                <img src ={userImageurl} alt={userName} height="150px" width="150px" />
            </label>
            <input onChange={handleChange} type="file" id="image-input" accept="image/*" style={{display:'none'}} />
        </div> 
    )
}

function UserName({name,handleNameChange}) {
    const [userName,setUserName] = useState(name);

    function handleChange(e) {
        setUserName(e.target.value);
        handleNameChange(e.target.value);
    }

    return (
        <div className="userNameOverlay">
            <label htmlFor="userNameInput"><i className="fa fa-id-card-o" aria-hidden="true"></i> Full Name :- 
            </label>
            <input value={userName} onChange={handleChange} type="text" id="userNameInput" name="userNameInput" />  
        </div>
    )
}

function UserDesignation({designation,handleDesignationChange}) {
    const [userDesignation,setUserDesignation] = useState(designation);

    function handleChange(e) {
        setUserDesignation(e.target.value);
        handleDesignationChange(e.target.value);
    }

    return (
        <div className="userDesignationOverlay">
            <label htmlFor="userDesignationInput"><i className="fa fa-id-badge" aria-hidden="true"></i> Designation :- </label>
            <input value={userDesignation} onChange={handleChange} type="text" id="userDesignationInput" name="userDesignationInput" />  
        </div>
    )
}

function UserLocation({location,handleLocationChange}) {
    const [userLocation,setUserLocation] = useState(location);

    function handleChange(e) {
        setUserLocation(e.target.value);
        handleLocationChange(e.target.value);
    }

    return (
        <div className="userLocationOverlay">
            <label htmlFor="userLocationInput"><i className="fa fa-map-marker" aria-hidden="true"></i> Location :- </label>
            <input value={userLocation} onChange={handleChange} type="text" id="userLocationInput" name="userLocationInput" />  
        </div>
    )
}

function UserEmail({email,handleEmailChange}) {

    const [userEmail,setUserEmail] = useState(email);

    function handleChange(e) {
        setUserEmail(e.target.value);
        handleEmailChange(e.target.value);
    }

    return (
        <div className="userEmailOverlay">
            <label htmlFor="userEmailInput"><i className="fa fa-envelope" aria-hidden="true"></i> Email :- </label>
            <input value={userEmail} onChange={handleChange} type="text" id="userEmailInput" name="userEmailInput" />  
        </div>
    )
}

function UserPhone({phone,handlePhoneChange}) {

    const [userPhone,setUserPhone] = useState(phone);

    function handleChange(e) {
        setUserPhone(e.target.value);
        handlePhoneChange(e.target.value);
    }

    return (
        <div className="userPhoneOverlay">
            <label htmlFor="userPhoneInput"><i className="fa fa-phone" aria-hidden="true"></i> Phone :- </label>
            <input value={+userPhone} onChange={handleChange} type="number" id="userPhoneInput" name="userPhoneInput" placeholder="(digits only)" />  
        </div>
    )
}

function UserOverlay({user,handleClose,handleSave,handleDelete}) {

    let userImageurl=user.imageUrl || "https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png"
    let userName = user.name || "";
    let userDesignation = user.designation || "";
    let userLocation = user.location || "";
    let userEmail = user.email || "";
    let userPhone = user.phone || "";
    
    function handleImageChange(imageUrl) {
        userImageurl = imageUrl;
    }

    function handleNameChange(name) {
        userName = name;
    }

    function handleDesignationChange(designation) {
        userDesignation = designation;
    }

    function handleLocationChange(location) {
        userLocation = location;
    }

    function handleEmailChange(email) {
        userEmail = email;
    }

    function handlePhoneChange(phone) {
        userPhone = phone;
    }

    function saveCallBack() {
        let newUser = {};
        if(isNaN(user.id)) {
            newUser.id = -1;
        }
        else {
            newUser.id = user.id;
            newUser.tasks = [...user.tasks];
        }
        newUser.imageUrl = userImageurl;
        newUser.name = userName;
        newUser.designation = userDesignation;
        newUser.location = userLocation;
        newUser.email = userEmail;
        newUser.phone = userPhone;
        handleSave(newUser);
    }

    function deleteCallBack() {
        if(isNaN(user.id)) {
            closeCallback();
        }
        else {
            handleDelete(user.id);
        }
    }
    
    function closeCallback () {
        handleClose();
    }

    return(
        <div className="userOverlayContainer">
            <div className="userOverlay">
                <div className="closeButton" onClick={closeCallback}>
                X
                </div>
                <UserImageurl imageUrl={userImageurl} userName={user.name} handleImageChange={handleImageChange} />
                <UserName name={userName} handleNameChange={handleNameChange} />
                <UserDesignation designation={userDesignation} handleDesignationChange={handleDesignationChange} />
                <UserLocation location={userLocation} handleLocationChange={handleLocationChange} />
                <UserEmail email={userEmail} handleEmailChange={handleEmailChange} />
                <UserPhone phone={user.phone} handlePhoneChange={handlePhoneChange} />

                <div className="overlayButtons">
                    <div className="saveButton" onClick={saveCallBack}>
                        <i className="fa fa-check" aria-hidden="true"></i> SAVE
                    </div>
                    <div className="deleteButton" onClick={deleteCallBack}>
                        <i className="fa fa-times" aria-hidden="true"></i> DELETE USER
                    </div>
                </div>
            </div>
        </div>
    );
}

function UserContainer({users}) 
{
    const [overlay,setOverlay] = useState(null);

    const editClick = useCallback((user) => setOverlay(user),[]);

    function handleClose() {
        setOverlay(null);
    }

    function handleSave(newUser) {
        if(newUser.id == -1) {
            newUser.id = users[users.length-1].id+1;
            newUser.tasks = [];
            users.push(newUser);
        }
        else {
            let ind = users.findIndex((user) => user.id == newUser.id);
            users[ind] = newUser;
        }
        commitUsers(users);
        setOverlay(null);
    }

    function handleDelete(id) {
        let ind = users.findIndex((user) => user.id == id);
        users.splice(ind,1);
        commitUsers(users);
        setOverlay(null);
    }

    let element;
    if(overlay == null) {
        element = <>
                    <div id="flexContainer">
                        {users.map((user) => <UserCard user={user} editClick={editClick} key={user.id}/>)}
                    </div>
                    <AddUserButton clickHandle={editClick}/>
                  </>;
    }

    else {
        element = <>
                    <UserOverlay user={overlay} handleClose={handleClose} handleSave={handleSave} handleDelete={handleDelete}/>
                    <div id="flexContainer">
                        {users.map((user) => <UserCard user={user} editClick={editClick} key={user.id}/>)}
                    </div>
                    <AddUserButton clickHandle={editClick}/>
                  </>;
    }
    return element;
}

function Team(props) {

    let users = fetchUsers();

    return (
        <section className="board">
            <UserContainer users={users}/>
        </section>
    );
}

function fetchUsers() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if(users.length == 0)
    {
        let newUser1 = {};
        newUser1.id = 0;
        newUser1.imageUrl = "https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png";
        newUser1.name = "Dhruv Patel";
        newUser1.designation = "project head";
        newUser1.location = "Mumbai, India";
        newUser1.email = "dhruv.patel@comapnay.com";
        newUser1.phone = "917878345672";
        newUser1.tasks = [0];
        users.push(newUser1);

        let newUser2 = {};
        newUser2.id = 1;
        newUser2.imageUrl = "assets/john-paul.jpeg";
        newUser2.name = "John Paul";
        newUser2.designation = "project manager";
        newUser2.location = "New York, USA";
        newUser2.email = "john.paul@comapnay.com";
        newUser2.phone = "19998645408";
        newUser2.tasks = [1];
        users.push(newUser2);

        commitUsers(users);
    }
    return users;
}

function commitUsers(users) {
    localStorage.setItem('users',JSON.stringify(users));
}

export default Team;