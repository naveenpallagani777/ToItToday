import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    activeTasks: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Task' // ✅ Correct reference
    }],
    deletedTasks: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Task' // ✅ Correct reference
    }],
    tags: [{ 
        type: String 
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    },
    completedAt: { 
        type: Date, 
        default: null 
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
