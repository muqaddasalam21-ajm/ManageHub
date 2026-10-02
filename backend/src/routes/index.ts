import { Router } from 'express';
import healthRoutes from './healthRoutes';
import taskRoutes from './taskRoutes';

const apiRouter = Router();

// Mount health routes at /api/v1/health
apiRouter.use('/', healthRoutes);

// Mount task CRUD routes at /api/v1/tasks
apiRouter.use('/tasks', taskRoutes);

export default apiRouter;
