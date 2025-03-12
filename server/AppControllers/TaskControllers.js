import Task from "../models/TaskModel.js";
import User from "../models/UserModel.js";

export const addUserTasks = async (req, res) => {
    try {
        const { title, description, priority, stage, subTasks, tag } = req.body;

        if (!title || !priority || !stage) {
            return res.status(400).json({ error: "Title, priority, and stage are required." });
        }
        console.log(req.user._id);
        const user = await User.findById(req.user._id);
        console.log(user);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const newTask = new Task({
            title,
            description,
            priority,
            stage,
            tag,
            subTasks,
            isCompleted: false
        });

        await newTask.save();
        
        user.activeTasks.push(newTask._id);
        await user.save();

        res.status(201).json({ message: "Task added successfully", task: newTask });

    } catch (error) {
        console.error("Error adding task:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

export const getUserTasks = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("activeTasks");
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            status: "success",
            message: "User tasks retrieved successfully",
            tasks: user.activeTasks
        });
    } catch (error) {
        console.error("Error fetching user tasks:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

export const getSingleTask = async (req, res) => {
    try {
        const { id } = req.params; // Extract task ID from URL parameters
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json({
            status: "success",
            message: "Task retrieved successfully",
            task,
        });
    } catch (error) {
        console.error("Error fetching task:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

export const updateUserTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const updates = req.body;

        const task = await Task.findByIdAndUpdate(taskId, updates, { new: true });

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json({
            status: "success",
            message: "Task updated successfully",
            task
        });
    } catch (error) {
        console.error("Error updating task:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

export const deleteUserTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const taskIndex = user.activeTasks.indexOf(taskId);
        if (taskIndex === -1) {
            return res.status(404).json({ error: "Task not found in active tasks" });
        }

        user.activeTasks.splice(taskIndex, 1);
        user.deletedTasks.push(taskId);

        await user.save();

        res.status(200).json({
            status: "success",
            message: "Task moved to deleted tasks successfully",
            deletedTasks: user.deletedTasks
        });
    } catch (error) {
        console.error("Error deleting task:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

export const getDeletedTasks = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("deletedTasks");
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            status: "success",
            message: "Deleted tasks retrieved successfully",
            deletedTasks: user.deletedTasks
        });
    } catch (error) {
        console.error("Error fetching deleted tasks:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

export const permanentlyDeleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (taskId === "all") {

            await Task.deleteMany({ _id: { $in: user.deletedTasks } });

            user.deletedTasks = [];
            await user.save();
            return res.status(200).json({
                status: "success",
                message: "All deleted tasks permanently removed",
                deletedTasks: user.deletedTasks
            });
        }

        const taskIndex = user.deletedTasks.indexOf(taskId);
        if (taskIndex === -1) {
            return res.status(404).json({ error: "Task not found in deleted tasks" });
        }

        await Task.findByIdAndDelete(taskId);

        user.deletedTasks.splice(taskIndex, 1);
        await user.save();

        res.status(200).json({
            status: "success",
            message: "Task permanently deleted successfully",
            deletedTasks: user.deletedTasks
        });
    } catch (error) {
        console.error("Error deleting task permanently:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

export const restoreUserTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (taskId === "all") {
            user.activeTasks.push(...user.deletedTasks);
            user.deletedTasks = [];
            await user.save();
            return res.status(200).json({
                status: "success",
                message: "All tasks restored successfully",
                activeTasks: user.activeTasks
            });
        }

        const taskIndex = user.deletedTasks.indexOf(taskId);
        if (taskIndex === -1) {
            return res.status(404).json({ error: "Task not found in deleted tasks" });
        }

        user.activeTasks.push(taskId);
        user.deletedTasks.splice(taskIndex, 1);
        await user.save();

        res.status(200).json({
            status: "success",
            message: "Task restored successfully",
            activeTasks: user.activeTasks
        });
    } catch (error) {
        console.error("Error restoring task:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};