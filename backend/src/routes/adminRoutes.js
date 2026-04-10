const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const projectController = require('../controllers/projectController');
const leadController = require('../controllers/leadController');
const libraryController = require('../controllers/libraryController');
const uploadController = require('../controllers/uploadController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const {
  validate,
  projectSchema,
  librarySchema,
  loginSchema,
  leadUpdateSchema,
} = require('../middleware/validateMiddleware');

/**
 * Auth Routes
 */
router.post('/auth/login', validate(loginSchema), authController.login);
router.post('/auth/logout', authenticate, authController.logout);
router.get('/auth/me', authenticate, authController.me);
router.get('/me', authenticate, authController.me);

/**
 * Protected Admin Routes - Require authentication
 */
router.use(authenticate);
router.use(requireAdmin);

// Projects Management
router.get('/projects', projectController.getAdminProjects);
router.get('/projects/stats', projectController.getProjectStats);
router.get('/projects/:id', projectController.getAdminProjectById);
router.post('/projects', validate(projectSchema), projectController.createProject);
router.put('/projects/:id', validate(projectSchema), projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);

// Leads Management
router.get('/leads', leadController.getLeads);
router.get('/leads/stats', leadController.getLeadStats);
router.get('/leads/export', leadController.exportLeads);
router.get('/leads/:id', leadController.getLeadById);
router.put('/leads/:id', validate(leadUpdateSchema), leadController.updateLead);
router.delete('/leads/:id', leadController.deleteLead);

// Library Management (Albums)
router.post('/library', validate(librarySchema), libraryController.createAlbum);
router.put('/library/:id', validate(librarySchema), libraryController.updateAlbum);
router.delete('/library/:id', libraryController.deleteAlbum);

// Upload Management
router.post('/upload/image', uploadController.upload.single('image'), uploadController.uploadImage);
router.post('/upload/images', uploadController.upload.array('images', 10), uploadController.uploadMultipleImages);
router.delete('/upload/image', uploadController.deleteImage);

module.exports = router;
