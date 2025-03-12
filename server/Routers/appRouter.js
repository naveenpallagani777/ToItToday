import express from 'express'; // ✅ Correct
import { login, signup } from '../AppControllers/UserControllers.js';
import { addUserTasks, 
    getUserTasks, 
    updateUserTask, 
    deleteUserTask, 
    getDeletedTasks, 
    permanentlyDeleteTask, 
    restoreUserTask,
    getSingleTask
 } from '../AppControllers/TaskControllers.js';
import requireAuth from '../middleware/requireAuth.js';

var router = express.Router();

// user login and signup
router.post('/user/login', login);
router.post('/user/signup', signup);

router.use(requireAuth);

router.post('/api/task', addUserTasks);
router.get('/api/task', getUserTasks);
router.get("/api/task/:id", getSingleTask);
router.put('/api/task/:taskId', updateUserTask);
router.delete('/api/task/:taskId', deleteUserTask);

router.get('/api/trash', getDeletedTasks);
router.delete('/api/trash/:taskId', permanentlyDeleteTask);

router.post('/api/trash/restore/:taskId', restoreUserTask);

export default router;