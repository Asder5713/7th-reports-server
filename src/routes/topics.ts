import express from 'express';
import { topicController } from '../controllers/topicController';

const router = express.Router();

// GET all topics
router.get('/', topicController.getAllTopics);

// GET topic by ID
router.get('/:id', topicController.getTopicById);

// POST create new topic
router.post('/', topicController.createTopic);

// PUT update topic
router.put('/:id', topicController.updateTopic);

// DELETE topic
router.delete('/:id', topicController.deleteTopic);

// GET topics by report
router.get('/report/:reportId', topicController.getTopicsByReport);

export default router; 