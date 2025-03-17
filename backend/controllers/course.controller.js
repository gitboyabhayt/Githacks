const Course = require('../models/course.model');

exports.createCourse = async (req, res) => {
    try {
        const course = await Course.create({
            ...req.body,
            instructor: req.user._id
        });
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
            .populate('instructor', 'username email')
            .select('-reviews');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'username email')
            .populate('reviews.user', 'username');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        Object.assign(course, req.body);
        await course.save();
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addReview = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const review = {
            user: req.user._id,
            rating: req.body.rating,
            comment: req.body.comment
        };
        course.reviews.push(review);
        course.rating = course.reviews.reduce((acc, item) => item.rating + acc, 0) / course.reviews.length;
        await course.save();
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.enrollCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (course.enrolledStudents.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already enrolled' });
        }
        course.enrolledStudents.push(req.user._id);
        await course.save();
        res.json({ message: 'Enrolled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};