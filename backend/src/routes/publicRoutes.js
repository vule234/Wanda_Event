const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const leadController = require('../controllers/leadController');
const libraryController = require('../controllers/libraryController');
const { validate, leadSchema } = require('../middleware/validateMiddleware');
const { leadBurstLimiter, leadLimiter } = require('../middleware/rateLimitMiddleware');
const { verifyTurnstile } = require('../middleware/turnstileMiddleware');
const { antiSpamGuard } = require('../middleware/antiSpamMiddleware');

/**
 * Public Routes - No authentication required
 */

// Projects
router.get('/projects', projectController.getProjects);
router.get('/projects/:slug', projectController.getProjectBySlug);

// Library (Albums)
router.get('/library', libraryController.getAlbums);
router.get('/library/:id', libraryController.getAlbumById);

// Leads (with rate limiting + anti-spam hardening + Turnstile)
router.post('/leads', leadBurstLimiter, leadLimiter, validate(leadSchema), verifyTurnstile, antiSpamGuard, leadController.createLead);

module.exports = router;
