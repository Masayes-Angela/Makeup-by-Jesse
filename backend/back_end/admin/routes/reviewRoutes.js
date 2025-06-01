import express from 'express';
import {
  submitReview,
  getPublishedReviews,
  getAllReviews,
  publishReview,
  hideReview
} from '../controllers/reviewController.js';

const router = express.Router();

// Public
router.post('/', submitReview);
router.get('/published', getPublishedReviews);

// Admin
router.get('/', getAllReviews);
router.patch('/:id/publish', publishReview);
router.patch('/:id/hide', hideReview);

export default router;