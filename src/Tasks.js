import { faUserInjured } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useState } from 'react/cjs/react.development';
import actions from './store/actions'

let statusMapping = ["Not started" , "In-progress" , "On hold" , "Completed"];
let monthMapping = ["Jan" , "Feb" , "Mar" , "Apr" , "May" , "Jun" , "Jul" , "Aug" , "Sep" , "Oct" , "Nov", "Dec"];
let statusColorMapping = ["yellow" , "purple" , "red" , "chartreuse"];
let mapStatus = {
    "Not started" : 0,
    "In-progress" : 1,
    "On hold" : 2,
    "Completed" : 3,
}


function getDateString(date) {
    let dateString = " ";
    dateString+=date.slice(8,10);
    dateString+=" ";
    dateString+=monthMapping[+date.slice(5,7)-1];
    dateString+=",";
    dateString+=date.slice(0,4);
    return dateString;
}

function getStageString(stages) {
    let totalStages = 0;
    let completedStages = 0;
    for(let prop in stages)
    {
        totalStages++;
        if(stages[prop])
        {
            completedStages++;
        }
    }
    let stagesString = " " + completedStages + "/" + totalStages;
    return stagesString;
}

function TaskInfo({task}) {
    return(
        <div className="taskInfo">
            <span className="taskStatus">
                <i className="fa fa-square taskStatusSymbol" aria-hidden="true" style={{color : statusColorMapping[task.status]}}></i> {statusMapping[task.status]}
            </span>
            <span className="taskDue">
                <i className="fa fa-clock-o" aria-hidden="true"></i> {getDateString(task.dueDate)}
            </span>
            <span>
                <i className="fa fa-check-square-o" aria-hidden="true"></i> {getStageString(task.stages)}
            </span>
        </div>
    );
}

const TaskImage = React.memo(function({src}) {
    return (
        <div className="taskImage">
            <img src = {src} height="160px" width="252px"/>
        </div>
    );
})

const TaskCard = React.memo(function({task,editClick}) {

    function editCallback() {
        editClick(task);
    }

    return (
        <div className="card" onClick={editCallback}>
            <TaskImage src={task.imageUrl} />
            <div className="taskTitle">
                {task.title}
            </div>
            <hr className="titleLineBreaks" />
            <TaskInfo task={task} />
        </div>
    )
});

function UserColumn({userTasks,userName,editClickHandle,userId}) {

    const editClick = useCallback((task) => editClickHandle(task),[]);

    return (
        <section className="board-list">
            <div className="tasksAdd" onClick={() => editClick({assignee: userId,imageUrl: "assets/default.png",status:0})}>
                <i className="fa fa-plus-circle" aria-hidden="true"></i>
            </div>
            <div className="list-title">
                {userName}
            </div>
            {userTasks.map(task => <TaskCard task={task} key={task.taskId} editClick={editClick}/>)}
        </section>
    );
}

function StagesDisplay({stages,closeStage}) {
    let stageArray = [];
    for(let stage in stages) {
        stageArray.push(stage);
    }

    function handleChange(e) {
        if(e.target.value == "on")
        {
            stages[e.target.dataset.stagename] = true;
        }
        else
        {
            stages[e.target.dataset.stagename] = false;
        }
    }

    function closeStageCallback(e) {
        closeStage(e.target.dataset.stagename);
    }

    return (
        <ul className="stagesList"> 
            {stageArray.map(function(stage,index){
                return (<li key={index}><input type="checkbox" defaultChecked={stages[stage]} onChange={handleChange} data-stagename={stage}/>{` ${stage}`}
                <span className="stageCloseButton" onClick={closeStageCallback} data-stagename={stage}>{" \u274c"}</span> 
                </li>);
            }   )}
        </ul>
    );
}

function TaskImageurl({image,handleImageChange}) {

    const [taskImage,setTaskImage] = useState(image);

    function handleChange(e) {
        let uploadUrl = e.target.value;
        uploadUrl = uploadUrl.slice(12);
        uploadUrl = 'assets/' + uploadUrl;
        setTaskImage(uploadUrl);
        handleImageChange(uploadUrl);
    }

    return (
        <div className="taskImageOverlay">
            <label htmlFor="task-image-input">
                <img src = {taskImage} height="160px" width="252px" />
            </label>
            <input onChange={handleChange} type="file" id="task-image-input" accept="image/*" style={{display:'none'}} />
        </div> 
    )
}

function TaskTitle({title,handleTitleChange}) {
    const [taskTitle,setTaskTitle] = useState(title);

    function handleChange(e) {
        setTaskTitle(e.target.value);
        handleTitleChange(e.target.value);
    }

    return (
        <div className="taskTitleOverlay">
            <label htmlFor="taskTitleInput"><i className="fa fa-pencil-square-o" aria-hidden="true"></i> Title :- </label>
            <input value={taskTitle} onChange={handleChange} type="text" id="taskTitleInput" name="taskTitleInput" />  
        </div>
    )
}

function TaskAssignee({users,assignee,handleAssigneeChange}) {

    const [taskAssignee,setTaskAssignee] = useState(assignee);

    function handleChange(e) {
        setTaskAssignee(e.target.value);
        handleAssigneeChange(e.target.value);
    }

    return (
        <div className="taskUserOverlay">
            <label htmlFor="taskUserInput"><i className="fa fa-user-circle-o" aria-hidden="true"></i> Assigee :- </label>
            <select id="taskUserInput" value={taskAssignee} onChange={handleChange}>
                {users.map(function(user) {
                    return (<option value={user.name} key={user.id}>{user.name}</option>);
                })}
            </select>  
        </div>
    )
}

function TaskStatus({status,handleStatusChange}) {

    const [taskStatus,setTaskStatus] = useState(status);

    function handleChange(e) {
        setTaskStatus(e.target.value);
        handleStatusChange(e.target.value);
    }
    return (
        <div className="taskStatusOverlay">
            <label htmlFor="taskSatusInput"><i className="fa fa-arrow-circle-right" aria-hidden="true"></i>
                {` Status :-`}</label>
            <select id="taskStatusInput" value={taskStatus} onChange={handleChange}>
                <option value="Not started">Not started</option>
                <option value="In-progress">In-progress</option>
                <option value="On hold">On hold</option>
                <option value="Completed">Completed</option>
            </select>
        </div>
    );

}

function TaskDate({date,handleDateChange}) {
    const [taskDate,setTaskDate] = useState(date);

    function handleChange(e) {
        setTaskDate(e.target.value);
        handleDateChange(e.target.value);
    }

    return (
        <div className="taskDateOverlay">
            <label htmlFor="taskDateInput"><i className="fa fa-clock-o" aria-hidden="true"></i> Due date :- </label>
            <input value={taskDate} onChange={handleChange} type="date" id="taskDateInput" name="taskDateInput" placeholder="dd/mm/yyyy" />  
        </div>
    )
}


function TaskOverlay({task,users,handleClose,handleSave,handleDelete}) {

    let selectedIndex = useMemo(() => users.findIndex((user) => user.id == task.assignee),[task]);
    
    let taskImage = task.imageUrl || "assets/default.png";
    function handleImageChange(imageUrl) {
        taskImage = imageUrl;
    }

    let taskTitle = task.title || "";
    function handleTitleChange(title) {
        taskTitle = title;
    }

    let taskAssignee = users[selectedIndex].name;
    function handleAssigneeChange(assignee) {
        taskAssignee = assignee;
    }

    let taskStatus = statusMapping[task.status];
    function handleStatusChange(status) {
        taskStatus = status;
    }

    let taskDate = task.dueDate || "";
    function handleDateChange(date) {
        taskDate = date;
    }

    const [taskStages,setTaskstages] = useState(task.stages);

    function deleteStageHandle(stageName) {
        let newStages = {};
        for(let stage in taskStages) {
            newStages[stage] = taskStages[stage];
        }
        delete newStages[stageName];
        setTaskstages(newStages);
    }

    function addStageHandle() {
        let stageName = prompt("Enter stage name:- ","");
        if(stageName=="" || stageName == null)
        {
            return;
        }
        let newStages = {};
        for(let stage in taskStages) {
            newStages[stage] = taskStages[stage];
        }
        newStages[stageName] = false;
        setTaskstages(newStages);
    }

    function closeCallback () {
        handleClose();
    }

    function saveCallBack() {
        let currentAssigneeIndex = users.findIndex((user) => user.name == taskAssignee);
        let newTask = {};
        if(isNaN(task.taskId)) {
            newTask.taskId = -1;
        }
        else {
            newTask.taskId = task.taskId;
        }
        newTask.imageUrl = taskImage;
        newTask.title = taskTitle;
        newTask.assignee = users[currentAssigneeIndex].id;
        newTask.status = mapStatus[taskStatus];
        newTask.stages = {};
        for(let stage in taskStages) {
            newTask.stages[stage] = taskStages[stage];
        }
        newTask.dueDate = taskDate;
        handleSave(newTask);
    }

    function deleteCallBack() {
        if(isNaN(task.taskId)) {
            closeCallback();
        }
        else {
            let ind = users[selectedIndex].tasks.findIndex((taskId) => taskId == task.taskId);
            users[selectedIndex].tasks.splice(ind,1);
            handleDelete(task.taskId);
        }
    }


    return (
        <div className="tasksOverlayContainer">
            <div className="tasksOverlay">
                <div className="closeButton" onClick={closeCallback}>
                X
                </div>

                <TaskImageurl image={taskImage} handleImageChange={handleImageChange} />
                <TaskTitle title={taskTitle} handleTitleChange={handleTitleChange} />
                <TaskAssignee users={users} assignee={taskAssignee} handleAssigneeChange={handleAssigneeChange} />
                <div className="taskStagesOverlay">
                    <label><i className="fa fa-check-square-o" aria-hidden="true"></i> Stages :- </label>
                    <StagesDisplay stages={taskStages} closeStage={deleteStageHandle}/>
                    <div className="addStageButton" onClick={addStageHandle}>
                        <i className="fa fa-plus" aria-hidden="true"></i> Add Stage
                    </div>
                </div>

                <TaskStatus status={taskStatus} handleStatusChange={handleStatusChange} />
                <TaskDate date={taskDate} handleDateChange={handleDateChange} />
                <div className="overlayButtons">
                <div className="saveButton" onClick={saveCallBack}>
                    <i className="fa fa-check" aria-hidden="true"></i> SAVE
                </div>
                <div className="deleteButton" onClick={deleteCallBack}>
                    <i className="fa fa-times" aria-hidden="true"></i> DELETE CARD
                </div>
                </div>
            </div>
        </div>
    );
}

function TasksContainer() {

    const tasks = useSelector(state => state.tasks);
    const users = useSelector(state => state.users);
    const dispatch = useDispatch();

    const [overlay,setOverlay] = useState(null);

    function editClickHandle(task) {
        setOverlay(task);
    }

    function handleClose() {
        setOverlay(null);
    }

    function handleSave(newTask) {
        if(newTask.taskId == -1) {
            newTask.taskId = tasks[tasks.length-1].taskId+1;
            dispatch(actions.addTask(newTask));
        }
        else {
            dispatch(actions.updateTask(newTask.taskId,newTask));
        }
        taskMap.set(newTask.taskId,newTask);
        setOverlay(null);
    }
    
    function handleDelete(id) {
        dispatch(actions.removeTask(id));
        setOverlay(null);
    }

    let taskMap = new Map();
    tasks.forEach(element => {
        taskMap.set(element.taskId,element);
    });

    if(overlay == null) {
        return(
                <>
                    <div className="board-lists">
                        {users.map(function (user) {
                            let userTasks = [];
                            user.tasks.forEach(id => userTasks.push(taskMap.get(id)));
                            return <UserColumn userTasks={userTasks} key={user.id} userName={user.name} editClickHandle={editClickHandle} userId={user.id}/>
                        })}
                    </div> 
                </>
            )
    }

    else {
        return(
            <>
                <div className="board-lists">
                    {users.map(function (user) {
                        let userTasks = [];
                        user.tasks.forEach(id => userTasks.push(taskMap.get(id)));
                        return <UserColumn userTasks={userTasks} key={user.id} userName={user.name} editClickHandle={editClickHandle}/>
                    })}
                </div> 
                <TaskOverlay task={overlay} users={users} handleClose={handleClose} handleSave={handleSave} handleDelete={handleDelete}/>
            </>
        )
    }
}


function Tasks(props) {
    return (
        <section className="board">
            <TasksContainer />
        </section>
    )
}

export default Tasks;