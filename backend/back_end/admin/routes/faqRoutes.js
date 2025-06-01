import express from 'express';
import {
  getActiveFaqs,
  getAllFaqs,
  addFaq,
  updateFaq,
  deactivateFaq
} from '../controllers/faqController.js';

const router = express.Router();

// Public view
router.get('/public', getActiveFaqs);

// Admin views
router.get('/', getAllFaqs);
router.post('/', addFaq);
router.put('/:id', updateFaq);
router.patch('/:id/deactivate', deactivateFaq);

export default router;
