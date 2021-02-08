let nextID = 0;

function taskConstructor() 
{
    this.taskid = nextID++;
    this.imageUrl = null;
    this.title = null;
    this.assignee = null;
    this.status = 0;
    this.dueDate = "2010-12-31";
    this.stages = {};
}

function taskToCard(task,card)
{
    card.querySelector(".taskImage img").src = task.imageUrl;
    card.querySelector(".taskTitle").innerHTML = task.title;
    let taskStatus = card.querySelector(".taskInfo .taskStatus");
    let taskStatusSymbol = taskStatus.querySelector('.taskStatusSymbol');
    taskStatusSymbol.style.color = statusColorMapping[task.status];
    taskStatusSymbol.nextSibling.textContent = " " + statusMapping[task.status];
    let DateString = " ";
    DateString+=task.dueDate.slice(8,10);
    DateString+=" ";
    DateString+=monthMapping[+task.dueDate.slice(5,7)-1];
    DateString+=",";
    DateString+=task.dueDate.slice(0,4);
    card.querySelector('.taskInfo .taskDue').firstElementChild.nextSibling.textContent = DateString;
    let totalStages = 0;
    let completedStages = 0;
    for(let prop in task.stages)
    {
        totalStages++;
        if(task.stages[prop])
        {
            completedStages++;
        }
    }
    let stagesString = " " + completedStages + "/" + totalStages;
    card.querySelector('.taskInfo').lastElementChild.firstElementChild.nextSibling.textContent = stagesString;
}

function editTaskClicked(event) 
{
    let currentCard = event.target.closest(".card");
    if(currentCard == null)
    {
        return;
    }
    currenttaskID = currentCard.dataset.taskid;
    let currentTask = tasks.find(task => task.taskid == currenttaskID);
    currentboardID = currentTask.assignee;
    let overlayContainer = document.body.querySelector('.tasksOverlayContainer');
    overlayContainer.style.display = 'block';
    overlayContainer.querySelector('.taskImageOverlay img').src = currentTask.imageUrl;
    overlayContainer.querySelector('.taskTitleOverlay input').value = currentTask.title;
    let taskUserSelector = overlayContainer.querySelector('.taskUserOverlay select');
    taskUserSelector.innerHTML = null;
    let totalIndex = -1;
    let selectedIndex;
    users.forEach(
        function(user) {
            let userSelect = document.createElement('option');
            userSelect.value = user.name;
            userSelect.innerHTML = user.name;
            totalIndex++;
            if(user.id == currentTask.assignee) {
                selectedIndex = totalIndex;
            }
            taskUserSelector.appendChild(userSelect);
        }
    )
    taskUserSelector.selectedIndex = selectedIndex;
    let stagesList = overlayContainer.querySelector('.taskStagesOverlay .stagesList');
    stagesList.innerHTML = null;
    for(let prop in currentTask.stages)
    {
        let newLI = document.createElement("li");
        let newCheckbox = document.createElement("input");
        newCheckbox.type = "checkbox";
        if(currentTask.stages[prop])
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
    overlayContainer.querySelector('.taskStatusOverlay select').selectedIndex = currentTask.status;
    overlayContainer.querySelector('.taskDateOverlay input').value = currentTask.dueDate;
}

function addTaskClicked(event)
{
    if(!(event.target.classList.contains('tasksAdd') || event.target.classList.contains('fa')))
    {
        return;
    }
    currenttaskID = -1;
    currentboardID = event.target.closest('.board-list').dataset.boardid;
    let overlayContainer = document.body.querySelector('.tasksOverlayContainer');
    overlayContainer.style.display = 'block';
    overlayContainer.querySelector('.taskImageOverlay img').src = 'assets/default.png';
    overlayContainer.querySelector('.taskTitleOverlay input').value = "";
    let taskUserSelector = overlayContainer.querySelector('.taskUserOverlay select');
    taskUserSelector.innerHTML = null;
    let totalIndex = -1;
    let selectedIndex;
    users.forEach(
        function(user) {
            let userSelect = document.createElement('option');
            userSelect.value = user.name;
            userSelect.innerHTML = user.name;
            totalIndex++;
            if(user.id == currentboardID) {
                selectedIndex = totalIndex;
            }
            taskUserSelector.appendChild(userSelect);
        }
    )
    taskUserSelector.selectedIndex = selectedIndex;
    let stagesList = overlayContainer.querySelector('.taskStagesOverlay .stagesList');
    stagesList.innerHTML = null;
    overlayContainer.querySelector('.taskStatusOverlay select').selectedIndex = 0;
    overlayContainer.querySelector('.taskDateOverlay input').value = "2010-12-31";
}

function overlayToTask(task)
{
    let overlay = document.querySelector('.tasksOverlay');
    task.imageUrl = overlay.querySelector('.taskImageOverlay img').src;
    task.title = overlay.querySelector('.taskTitleOverlay input').value;
    let assigneeSelect = document.getElementById('taskUserInput');
    task.assignee = userIds[assigneeSelect.selectedIndex];
    let statusSelect = document.getElementById('taskStatusInput');
    task.status = statusSelect.selectedIndex;
    task.stages = {};
    let stagesList = overlay.querySelectorAll('.stagesList li');
    for(let stage of stagesList)
    {
        let stageNameCheckbox = stage.firstElementChild;
        let stageName = stageNameCheckbox.nextSibling.textContent;
        if(stageNameCheckbox.checked)
        {
            task.stages[stageName] = true;
        }
        else
        {
            task.stages[stageName] = false;
        }
    }
    let dueDateText = overlay.querySelector('.taskDateOverlay input').value;
    task.dueDate = dueDateText;
}

function closeOverlay()
{
    currenttaskID = -1;
    currentboardID = -1;
    let overlayContainer = document.body.querySelector('.tasksOverlayContainer');
    overlayContainer.style.display = 'none';
}

function saveTaskClicked(event)
{
    let task;
    let taskCard;
    if(currenttaskID == -1)
    {
        task = new taskConstructor();
        tasks.push(task);
        taskCard = cardTemplate.cloneNode(true);
        taskCard.dataset.taskid = task.taskid;
    }
    else
    {
        task = tasks.find(task => task.taskid == currenttaskID);
        taskCard = document.body.querySelector(`.card[data-taskid="${currenttaskID}"]`);
    }
    overlayToTask(task);
    taskToCard(task,taskCard);
    if((currenttaskID == -1) || (currentboardID != task.assignee))
    {
        let taskParentCard = document.body.querySelector(`.board-list[data-boardid="${task.assignee}"]`);
        taskParentCard.appendChild(taskCard);
    }
    localStorage['tasks'] = JSON.stringify(tasks);
    closeOverlay();
}

function deleteTaskClicked()
{
    if(currenttaskID == -1)
    {
        closeOverlay();
    }
    else
    {
        let taskIndex = tasks.findIndex(task => task.taskid == currenttaskID);
        taskCard = document.body.querySelector(`.card[data-taskid="${currenttaskID}"]`);
        tasks.splice(taskIndex,1);
        taskCard.remove();
    }
    localStorage['tasks'] = JSON.stringify(tasks);
    closeOverlay();
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

document.body.querySelector('.board-lists').addEventListener('click',editTaskClicked);
document.body.querySelector('.board-lists').addEventListener('click',addTaskClicked);
document.body.querySelector('.overlayButtons .saveButton').addEventListener('click',saveTaskClicked);
document.body.querySelector('.overlayButtons .deleteButton').addEventListener('click',deleteTaskClicked);
document.body.querySelector('.tasksOverlay .closeButton').addEventListener('click',closeOverlay);
document.body.querySelector('.tasksOverlay .addStageButton').addEventListener('click',addStageClicked);
document.body.querySelector('.tasksOverlay .stagesList').addEventListener('click',deleteStageClicked);

let statusMapping = ["Not started" , "In-progress" , "On hold" , "Completed"];
let monthMapping = ["Jan" , "Feb" , "Mar" , "Apr" , "May" , "Jun" , "Jul" , "Aug" , "Sep" , "Oct" , "Nov", "Dec"];
let statusColorMapping = ["yellow" , "purple" , "red" , "chartreuse"];
let currenttaskID = -1;
let currentboardID = -1;
let cardTemplate = document.body.querySelector('.card').cloneNode(true);
let users = JSON.parse(localStorage["users"]);

let gridContainer = document.body.querySelector('.board-lists');
gridContainer.innerHTML = null;
userIds = [];
users.forEach(
    function(user) {
        let currentUserBoard = document.createElement("section");
        currentUserBoard.classList.add("board-list");
        let taskAddSymbol = document.createElement("div");
        taskAddSymbol.classList.add("tasksAdd");
        taskAddSymbol.innerHTML = `<i class="fa fa-plus-circle" aria-hidden="true"></i></i>`;
        currentUserBoard.appendChild(taskAddSymbol);
        let taskTitle = document.createElement("div");
        taskTitle.classList.add("list-title");
        taskTitle.innerHTML = user.name;
        currentUserBoard.appendChild(taskTitle);
        currentUserBoard.dataset.boardid = user.id;
        gridContainer.appendChild(currentUserBoard);
        userIds.push(user.id);
    }
);

let tasks = JSON.parse(localStorage["tasks"] || null);
if(tasks == null)
{
    tasks = [];
    let newTask1 = new taskConstructor();
    newTask1.imageUrl = "assets/macd-first-page.jpeg";
    newTask1.title = "Create welcome page of the restaurant";
    newTask1.assignee = 0;
    newTask1.status = 0;
    newTask1.dueDate = "2020-12-25";
    newTask1.stages = {
        "Write HTML document" : false,
        "Add styling to the page using CSS" : false,
        "Add interaction using Javascript" : false,
        "Deploy the page" : false,
    };
    tasks.push(newTask1);

    let newTask2 = new taskConstructor();
    newTask2.imageUrl = "assets/default.png";
    newTask2.title = "create customer care utility";
    newTask2.assignee = 1;
    newTask2.status = 0;
    newTask2.dueDate = "2020-12-25";
    newTask2.stages = {
        "Build static layout" : false,
        "Add UI in the page" : false,
        "Create chatbot" : false,
        "Design ML model for chatbot" : false,
    };
    tasks.push(newTask2);

    localStorage['tasks'] = JSON.stringify(tasks);
}
else 
{
    nextID = tasks[tasks.length-1].taskid+1;
}

tasks.forEach(
    function(task) {
        let currentTaskCard = cardTemplate.cloneNode(true);
        currentTaskCard.dataset.taskid = task.taskid;
        taskToCard(task,currentTaskCard);
        let currentTaskParent = gridContainer.querySelector(`.board-list[data-boardid="${task.assignee}"]`);
        currentTaskParent.appendChild(currentTaskCard);
    }
);

document.body.querySelector('.topnav .team').addEventListener('click',function() {
    location.assign("users.html");
});

