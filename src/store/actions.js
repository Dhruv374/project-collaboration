const addUser = user => {
    return {
        type: "ADD_USER",
        payload: user,
    }
}

const removeUser = id => {
    return {
        type: "REMOVE_USER",
        payload: id,
    }
}

const addTask = task => {
    return {
        type: "ADD_TASK",
        payload: task,
    }   
}

const removeTask = taskId => {
    return {
        type: "REMOVE_TASK",
        payload: taskId,
    }
}

const updateUser = (id,user) => {
    return {
        type: "UPDATE_USER",
        payload: {
            id,
            user,
        }
    }
}

const updateTask = (taskId,task) => {
    return {
        type: "UPDATE_TASK",
        payload: {
            taskId,
            task,
        }
    }
}

const actions = {
    addUser,
    removeUser,
    addTask,
    removeTask,
    updateUser,
    updateTask,
}

export default actions;