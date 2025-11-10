import express from 'express';
import { getBooks } from '../controllers/bookController.ts';

const router = express.Router();

router.get('/', getBooks);

export default router;
