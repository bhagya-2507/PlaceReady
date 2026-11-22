const Company = require('../models/Company');
const ApiResponse = require('../utils/apiResponse');

const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    return ApiResponse.success(res, 'Companies retrieved', companies);
  } catch (error) {
    next(error);
  }
};

const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return ApiResponse.error(res, 'Company not found', 404);
    }
    return ApiResponse.success(res, 'Company details retrieved', company);
  } catch (error) {
    next(error);
  }
};

const createCompany = async (req, res, next) => {
  try {
    const { name, industry, website, location, description, contactEmail } = req.body;
    const existing = await Company.findOne({ name: name.trim() });
    if (existing) {
      return ApiResponse.error(res, 'A company with this name already exists', 400);
    }

    const company = await Company.create({
      name: name.trim(),
      industry: industry || 'Technology',
      website: website || '',
      location: location || 'Pan India',
      description: description || '',
      contactEmail: contactEmail || '',
      isVerified: true,
    });

    return ApiResponse.success(res, 'Company created successfully', company, 201);
  } catch (error) {
    next(error);
  }
};

const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!company) {
      return ApiResponse.error(res, 'Company not found', 404);
    }
    return ApiResponse.success(res, 'Company updated successfully', company);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
};
