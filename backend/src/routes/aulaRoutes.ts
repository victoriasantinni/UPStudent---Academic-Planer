import { Router } from 'express';
import { getDaysWithAulas, updateDiaAulas } from '../controllers/aulaController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();


router.use(authMiddleware);

router.get('/', getDaysWithAulas);           
router.patch('/:diaId', updateDiaAulas);     

export default router;