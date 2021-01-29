let statusMapping = ["Not started" , "In-progress" , "On hold" , "Completed"];
let monthMapping = ["Jan" , "Feb" , "Mar" , "Apr" , "May" , "Jun" , "Jul" , "Aug" , "Sep" , "Oct" , "Nov", "Dec"];
let statusColorMapping = ["yellow" , "purple" , "red" , "chartreuse"];
let users = ["Dhruv Patel" , "John Paul"];
let currentTask = null;
let addingNewTask = false;
let cardTemplate = document.querySelector('.card').cloneNode(true);

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function displayTaskOverlay() 
{
    currentTask = this;
    let overlayContainer = document.body.querySelector('.tasksOverlayContainer');
    overlayContainer.style.display = 'block';
    currentDataObject = taskElementToData.get(this);
    overlayContainer.querySelector('.taskImageOverlay img').src = currentDataObject.imageUrl;
    overlayContainer.querySelector('.taskTitleOverlay input').value = currentDataObject.title;
    overlayContainer.querySelector('.taskUserOverlay select').selectedIndex = currentDataObject.assignee;
    let stagesList = overlayContainer.querySelector('.taskStagesOverlay .stagesList');
    stagesList.innerHTML = null;
    for(let prop in currentDataObject.stages)
    {
        let newLI = document.createElement("li");
        let newCheckbox = document.createElement("input");
        newCheckbox.type = "checkbox";
        if(currentDataObject.stages[prop])
        {
            newCheckbox.checked = true;
        }
        else
        {
            newCheckbox.checked = false;
        }
        let newText = document.createTextNode(" "+prop);
        let closeSymbol = document.createElement('span');
        closeSymbol.innerHTML = "&nbsp &nbsp \u274c";
        closeSymbol.classList.add('stageCloseButton');
        newLI.appendChild(newCheckbox);
        newLI.appendChild(newText);
        newLI.appendChild(closeSymbol);
        stagesList.appendChild(newLI);
    }
    overlayContainer.querySelector('.taskStatusOverlay select').selectedIndex = currentDataObject.status;
    overlayContainer.querySelector('.taskDateOverlay input').value = formatDate(currentDataObject.dueDate);
}

function dataObjectConstructor() 
{
    this.imageUrl = null;
    this.title = null;
    this.assignee = null;
    this.status = 0;
    this.dueDate = new Date(1970,12,31);
    this.stages = {};
}

function closeTaskOverlay()
{
    if(addingNewTask)
    {
        addingNewTask = false;
        currentTask.remove();
        currentTask = null;
    }
    let overlayContainer = this.parentElement.parentElement;
    overlayContainer.style.display = 'none';
}

function elementToData(task)
{
    let currentDataObject = taskElementToData.get(task);
    let overlay = document.querySelector('.tasksOverlay');
    currentDataObject.imageUrl = overlay.querySelector('.taskImageOverlay img').src;
    currentDataObject.title = overlay.querySelector('.taskTitleOverlay input').value;
    let assigneeSelect = document.getElementById('taskUserInput');
    currentDataObject.assignee = assigneeSelect.selectedIndex;
    let statusSelect = document.getElementById('taskStatusInput');
    currentDataObject.status = statusSelect.selectedIndex;
    currentDataObject.stages = {};
    let stagesList = overlay.querySelectorAll('.stagesList li');
    for(let stage of stagesList)
    {
        let stageNameCheckbox = stage.firstElementChild;
        let stageName = stageNameCheckbox.nextSibling.textContent;
        if(stageNameCheckbox.checked)
        {
            currentDataObject.stages[stageName] = true;
        }
        else
        {
            currentDataObject.stages[stageName] = false;
        }
    }
    let dueDateText = overlay.querySelector('.taskDateOverlay input').value;
    currentDataObject.dueDate = new Date(dueDateText);
}

function dataToDisplay(task)
{
    let currentDataObject = taskElementToData.get(task);
    task.querySelector(".taskImage img").src = currentDataObject.imageUrl;
    task.querySelector(".taskTitle").innerHTML = currentDataObject.title;
    let taskStatus = task.querySelector(".taskInfo .taskStatus");
    let taskStatusSymbol = taskStatus.querySelector('.taskStatusSymbol');
    taskStatusSymbol.style.color = statusColorMapping[currentDataObject.status];
    taskStatusSymbol.nextSibling.textContent = " " + statusMapping[currentDataObject.status];
    let DateString = " ";
    DateString+=currentDataObject.dueDate.getDate();
    DateString+=" ";
    DateString+=monthMapping[currentDataObject.dueDate.getMonth()];
    DateString+=",";
    DateString+=currentDataObject.dueDate.getFullYear();
    task.querySelector('.taskInfo .taskDue').firstElementChild.nextSibling.textContent = DateString;
    let totalStages = 0;
    let completedStages = 0;
    for(let prop in currentDataObject.stages)
    {
        totalStages++;
        if(currentDataObject.stages[prop])
        {
            completedStages++;
        }
    }
    let stagesString = " " + completedStages + "/" + totalStages;
    task.querySelector('.taskInfo').lastElementChild.firstElementChild.nextSibling.textContent = stagesString;
}

function saveClick()
{
    if(addingNewTask)
    {
        addingNewTask = false;
    }
    elementToData(currentTask);
    dataToDisplay(currentTask);
    let currentTaskAssignee = taskElementToData.get(currentTask).assignee;  //new added code
    if(!indexToUserBoard[currentTaskAssignee].contains(currentTask))
    {
        indexToUserBoard[currentTaskAssignee].appendChild(currentTask);
    }
    let overlayContainer = this.parentElement.parentElement.parentElement;
    overlayContainer.style.display = 'none';
}

function addTask()
{
    addingNewTask = true;
    let parentUser = this.parentElement;
    let userIndex = userBoardToIndex.get(parentUser);
    let newCardNode = cardTemplate.cloneNode(true);
    newCardNode.querySelector('.taskImage img').src = "assets/default.png";
    newCardNode.querySelector('.taskTitle').innerHTML = "";
    let taskStatus = newCardNode.querySelector(".taskInfo .taskStatus");
    let taskStatusSymbol = taskStatus.querySelector('.taskStatusSymbol');
    taskStatusSymbol.style.color = statusColorMapping[0];
    taskStatusSymbol.nextSibling.textContent = "";
    newCardNode.querySelector('.taskInfo .taskDue').firstElementChild.nextSibling.textContent = "";
    newCardNode.querySelector('.taskInfo').lastElementChild.firstElementChild.nextSibling.textContent = "";
    let newDataObject = new dataObjectConstructor();
    newDataObject.assignee = userIndex;
    newDataObject.imageUrl = "assets/default.png";
    currentTask = newCardNode;
    taskElementToData.set(newCardNode,newDataObject);
    newCardNode.addEventListener('click',displayTaskOverlay);
    displayTaskOverlay.call(newCardNode);
    parentUser.appendChild(newCardNode);
}

function deleteClick()
{
    currentTask.remove();
    currentTask = null;
    let overlayContainer = this.parentElement.parentElement.parentElement;
    overlayContainer.style.display = 'none';
}

function changeTaskImageClicked(event)
{   
    let uploadUrl = document.body.querySelector('.taskImageOverlay input').value;
    uploadUrl = uploadUrl.slice(12);
    uploadUrl = 'assets/' + uploadUrl;
    let currentImage = document.body.querySelector('.taskImageOverlay img');
    currentImage.src = uploadUrl;
}

function deleteStageClicked(event)
{
    if(!event.target.classList.contains('stageCloseButton'))
    {
        return;
    }
    event.target.parentElement.remove();
}

function addStageClicked(event)
{
    let stageName = prompt("Enter stage name:- ","");
    if(stageName=="" || stageName == null)
    {
        return;
    }
    let stagesList = document.body.querySelector('.taskStagesOverlay .stagesList');
    let newLI = document.createElement("li");
    let newCheckbox = document.createElement("input");
    newCheckbox.type = "checkbox";
    newCheckbox.checked = false;
    let newText = document.createTextNode(" "+stageName);
    let closeSymbol = document.createElement('span');
    closeSymbol.innerHTML = "&nbsp &nbsp \u274c";
    closeSymbol.classList.add('stageCloseButton');
    newLI.appendChild(newCheckbox);
    newLI.appendChild(newText);
    newLI.appendChild(closeSymbol);
    stagesList.appendChild(newLI);
}

let userBoardToIndex = new Map();
let indexToUserBoard = []; //new addded code
let allUserBoards = document.body.querySelectorAll('.board-list');
let temp = 0;
for(let board of allUserBoards)
{
    userBoardToIndex.set(board,temp++);
    indexToUserBoard.push(board);
}

let taskElementToData = new Map();
let allTasks = document.body.querySelectorAll(".card");
for(let task of allTasks) 
{
    let dataObject = {};
    dataObject.imageUrl = "assets/macd-first-page.jpeg";
    dataObject.title = "Create welcome page for restaurant";
    dataObject.assignee = 0;
    dataObject.status = 0;
    dataObject.dueDate = new Date(2020,11,25);
    dataObject.stages = {
        "Create HTML Page": false,
        "Add CSS to the Page": false,
        "Add javascript": false,
        "Deplpoy the page": false,
    }
    taskElementToData.set(task,dataObject);
}

for(let task of allTasks)
{
    task.addEventListener('click',displayTaskOverlay);
}

let overlayCloseButton = document.body.querySelector('.closeButton');
overlayCloseButton.addEventListener('click',closeTaskOverlay);
let overlaySaveButton = document.body.querySelector('.saveButton');
overlaySaveButton.addEventListener('click',saveClick);

let allAddButtons = document.body.querySelectorAll('.tasksAdd');
for(let addButton of allAddButtons)
{
    addButton.addEventListener('click',addTask);
}

let overlayDeleteButton = document.body.querySelector('.deleteButton');
overlayDeleteButton.addEventListener('click',deleteClick);

document.body.querySelector('.taskImageOverlay input').addEventListener('change',changeTaskImageClicked);
document.body.querySelector('.taskStagesOverlay').addEventListener('click',deleteStageClicked);
document.body.querySelector('.addStageButton').addEventListener('click',addStageClicked);
//new code starts here
document.body.querySelector('.topnav .team').addEventListener('click',function() {
    location.assign("users.html");
});

