const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    addReview,
    enrollCourse
} = require('../controllers/course.controller');

router.post('/', auth, createCourse);
router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.put('/:id', auth, updateCourse);
router.post('/:id/reviews', auth, addReview);
router.post('/:id/enroll', auth, enrollCourse);

module.exports = router;