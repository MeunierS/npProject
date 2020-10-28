//require
const { Router } = require('express');
const newsletterController = require('../controllers/newsletterController');

const router = Router();

router.post('/newsletter', newsletterController.newsletter_post); 

module.exports = router;