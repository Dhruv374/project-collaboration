import { useState } from "react";
import { act } from "react-dom/test-utils";
import Tasks from "../Tasks";
import actions from "./actions";

const rootReducer = (state = {},action) => {
    switch (action.type) {
        case "ADD_USER" :
            return (
                {
                    ...state,
                    users: [...state.users,action.payload],
                }
            )

        case "REMOVE_USER" :
            console.log(action);
            return (
                {
                    users: state.users.filter(user => user.id != action.payload),
                    tasks: state.tasks.filter(task => task.assignee != action.payload),
                }
            )

        case "ADD_TASK" : {
            let user = state.users.find(user => user.id == action.payload.assignee);
            user.tasks.push(action.payload.taskId);
            return (
                {
                    users: state.users,
                    tasks: [...state.tasks,action.payload],
                }
            )
        }

        case "REMOVE_TASK" : {
            let task = state.tasks.find(task => task.taskId == action.payload);
            let user = state.users.find(user => user.id == task.assignee);
            user.tasks = user.tasks.filter(taskId => taskId != action.payload);
            return (
                {
                    users: state.users,
                    tasks: state.tasks.filter(task => task.taskId != action.payload),
                }
            )
        }

        case "UPDATE_USER" : {
            let ind = state.users.findIndex(user => user.id == action.payload.id)
            return (
                {
                    ...state,
                    users: [...state.users.slice(0,ind),action.payload.user,...state.users.slice(ind+1)],
                }
            )
        }

        case "UPDATE_TASK" : {
            let ind = state.tasks.findIndex(task => task.taskId == action.payload.taskId);
            if(state.tasks[ind].assignee == action.payload.task.assignee) {
                return (
                    {
                        ...state,
                        tasks: [...state.tasks.slice(0,ind),action.payload.task,...state.tasks.slice(ind+1)]
                    }
                )
            }
            else {
                let user = state.users.find(user => user.id == state.tasks[ind].assignee);
                user.tasks = user.tasks.filter(taskId => taskId != action.payload.taskId);
                let newUser = state.users.find(user => user.id == action.payload.task.taskID);
                newUser.tasks = [...newUser.tasks, action.payload.task.taskID];
                return (
                    {
                        users: state.users,
                        tasks: [...state.tasks.slice(0,ind),action.payload.task,...state.tasks.slice(ind+1)]
                    }
                )
            }
        }

        default : return state;
    }
}

export default rootReducer;