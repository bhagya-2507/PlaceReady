const express = require('express');
const router = express.Router();
const {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);
router.post('/', protect, authorize('admin', 'recruiter'), createCompany);
router.put('/:id', protect, authorize('admin', 'recruiter'), updateCompany);

module.exports = router;
