let nextID = 0;
let userCardTemplate = document.body.querySelector('.flexItems').cloneNode(true);
let currentOpenID = -1;

function userConstructor()
{
    this.imageUrl = null;
    this.name = null;
    this.designation = null;
    this.location = null;
    this.email = null;
    this.phone = null;
}

function userToCard(user,currentUserCard)
{
    currentUserCard.querySelector('.userImage img').src = user.imageUrl;
    currentUserCard.querySelector('.userName').innerHTML = user.name;
    currentUserCard.querySelector('.userDesignation').innerHTML = user.designation;
    let tempChild = currentUserCard.querySelector('.userLocation').firstElementChild;
    currentUserCard.querySelector('.userLocation').innerHTML = null;
    currentUserCard.querySelector('.userLocation').appendChild(tempChild);
    let locationNode = document.createElement('span');
    locationNode.innerHTML = "&nbsp &nbsp" + user.location;
    currentUserCard.querySelector('.userLocation').appendChild(locationNode);
    currentUserCard.querySelector('.userMail').firstElementChild.nextSibling.textContent = " " + user.email;
    currentUserCard.querySelector('.userPhone').firstElementChild.nextSibling.textContent = " " + user.phone;
    currentUserCard.dataset.id = userToID.get(user);
}

function editClicked(event)
{
    if(!(event.target.classList.contains('userEdit') || event.target.classList.contains('fa')))
    {
         return;
    }
    let clickedUserCard = event.target.closest('.flexItems');
    let user = idToUser[clickedUserCard.dataset.id];
    currentOpenID = +clickedUserCard.dataset.id;
    let overlay = document.body.querySelector('.userOverlayContainer');
    overlay.querySelector('.userImageOverlay img').src = user.imageUrl;
    overlay.querySelector('.userNameOverlay input').value = user.name;
    overlay.querySelector('.userDesignationOverlay input').value = user.designation;
    overlay.querySelector('.userLocationOverlay input').value = user.location;
    overlay.querySelector('.userEmailOverlay input').value = user.email;
    overlay.querySelector('.userPhoneOverlay input').value = +user.phone;
    overlay.style.display = 'block';
}

function addUserClicked(event)
{
    currentOpenID = -1;
    let overlay = document.body.querySelector('.userOverlayContainer');
    overlay.querySelector('.userImageOverlay img').src = "https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png";
    overlay.querySelector('.userNameOverlay input').value = "";
    overlay.querySelector('.userDesignationOverlay input').value = "";
    overlay.querySelector('.userLocationOverlay input').value = "";
    overlay.querySelector('.userEmailOverlay input').value = "";
    overlay.querySelector('.userPhoneOverlay input').value = null;
    overlay.style.display = 'block';
}

function closeOverlay()
{
    let overlay = document.body.querySelector('.userOverlayContainer');
    overlay.style.display = 'none';
}

function saveClicked(event)
{
    let user
    let userCard;
    let overlay = document.body.querySelector('.userOverlayContainer');
    if(currentOpenID == -1)
    {
        user = new userConstructor();
        userToID.set(user,nextID);
        idToUser[nextID] = user;
        nextID++;
        userCard = userCardTemplate.cloneNode(true);
    }
    else
    {
        currentOpenID = currentOpenID.toString();
        user = idToUser[currentOpenID];
        userCard = document.body.querySelector(`.flexItems[data-id="${currentOpenID}"]`);
    }
    user.imageUrl = overlay.querySelector('.userImageOverlay img').src;
    user.name = overlay.querySelector('.userNameOverlay input').value;
    user.designation = overlay.querySelector('.userDesignationOverlay input').value;
    user.location = overlay.querySelector('.userLocationOverlay input').value;
    user.email = overlay.querySelector('.userEmailOverlay input').value;
    user.phone = overlay.querySelector('.userPhoneOverlay input').value;
    userToCard(user,userCard);
    if(currentOpenID == -1)
    {
        let flexContainer = document.getElementById('flexContainer');
        flexContainer.appendChild(userCard);
    }
    closeOverlay();
}

function deleteClicked(event)
{
    if(currentOpenID != -1)
    {
        let user = idToUser[currentOpenID.toString()];
        let userCard = document.body.querySelector(`.flexItems[data-id="${currentOpenID}"]`);
        delete idToUser[currentOpenID.toString()];
        userToID.delete(user);
        userCard.remove();
    }
    closeOverlay();
}

function changeImageClicked(event)
{   
    let uploadUrl = document.body.querySelector('.userImageOverlay input').value;
    uploadUrl = uploadUrl.slice(12);
    uploadUrl = 'assets/' + uploadUrl;
    let currentImage = document.body.querySelector('.userImageOverlay img');
    currentImage.src = uploadUrl;
}


let idToUser = {};
let newUser1 = new userConstructor();
newUser1.imageUrl = "https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png";
newUser1.name = "Dhruv Patel";
newUser1.designation = "project head";
newUser1.location = "Mumbai, India";
newUser1.email = "dhruv.patel@comapnay.com";
newUser1.phone = "+917878345672";
idToUser[nextID] = newUser1;
nextID++;

let newUser2 = new userConstructor();
newUser2.imageUrl = "assets/john-paul.jpeg";
newUser2.name = "John Paul";
newUser2.designation = "project manager";
newUser2.location = "New York, USA";
newUser2.email = "john.paul@comapnay.com";
newUser2.phone = "+19998645408";
idToUser[nextID] = newUser2;
nextID++;

let userToID = new Map();
let flexContainer = document.getElementById('flexContainer');
flexContainer.innerHTML = null;  //Danger here
for(let key in idToUser)
{  
    user = idToUser[key];
    userToID.set(user,+key);
    let currentUserCard = userCardTemplate.cloneNode(true);
    userToCard(user,currentUserCard);
    flexContainer.appendChild(currentUserCard);
}

document.getElementById('flexContainer').addEventListener('click',editClicked);
document.body.querySelector('.addUserContainer').addEventListener('click',addUserClicked);
document.body.querySelector('.saveButton').addEventListener('click',saveClicked);
document.body.querySelector('.deleteButton').addEventListener('click',deleteClicked);
document.body.querySelector('.closeButton').addEventListener('click',closeOverlay);
document.body.querySelector('.userImageOverlay input').addEventListener('change',changeImageClicked);


document.body.querySelector('.topnav .tasks').addEventListener('click',function() {
    location.assign("tasks.html");
});