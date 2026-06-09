import { Router } from 'express';
import { getDaysWithAulas, updateDiaAulas } from '../controllers/aulaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();


router.use(authMiddleware);

router.get('/', getDaysWithAulas);           
router.patch('/:diaId', updateDiaAulas);     

export default router;