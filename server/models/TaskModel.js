import mongoose from 'mongoose';

const subTaskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    isCompleted: { 
        type: Boolean, 
        default: false 
    },
}, { _id: true });

const taskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high'], 
        required: true 
    },
    stage: { 
        type: String, 
        enum: ['todo', 'in-progress', 'done'], 
        required: true 
    },
    subTasks: [subTaskSchema], 
    isCompleted: { 
        type: Boolean, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    completedAt: { 
        type: Date, 
        default: null 
    },
    tag: { 
        type: String, 
        default: 'general' 
    },
}, { timestamps: true, versionKey: false });

const Task = mongoose.model('Task', taskSchema);

export default Task;
