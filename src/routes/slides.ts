import express, { Request, Response } from 'express';
import { FilterQuery, Types } from 'mongoose';
import Slide, { ISlide } from '../models/Slide';
import { buildFilter, buildSort, checkForMoreSlides } from '../bl/slides.bl';

const router = express.Router();

// GET all slides
router.get('/', async (req: Request, res: Response) => {
  try {
    const slides = await Slide.find().select('-__v');

    res.json({
      success: true,
      data: slides,
      count: slides.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch slides',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET slide by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const slide = await Slide.findById(req.params.id).select('-__v');

    if (!slide) {
      return res.status(404).json({
        success: false,
        error: 'Slide not found'
      });
    }

    res.json({
      success: true,
      data: slide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch slide',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST create new slide
router.post('/', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    // Validate required fields
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }

    const slide = new Slide({
      content
    });

    const savedSlide = await slide.save();
    res.status(201).json({
      success: true,
      data: savedSlide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create slide',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT update slide
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const updateData: Partial<ISlide> = {};

    if (content) updateData.content = content;

    const slide = await Slide.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!slide) {
      return res.status(404).json({
        success: false,
        error: 'Slide not found'
      });
    }

    res.json({
      success: true,
      data: slide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update slide',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE slide
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const slide = await Slide.findByIdAndDelete(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        error: 'Slide not found'
      });
    }

    res.json({
      success: true,
      message: 'Slide deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete slide',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET slides by topic id paginated
router.get("/v1/topics/:topicId/slides", async (req: Request<{
  topicId: string, limit: number, cursorPos: any, cursorId: string, dir: 'next' | 'prev'
}>, res: Response) => {
  const { topicId, limit, cursorPos, cursorId, dir } = req.params;

  const filter = buildFilter(topicId, cursorPos, cursorId, dir);
  const sort = buildSort(dir);

  // Fetch items + peek one extra to compute hasMore reliably
  const queryLimit = limit + 1;
  let docs = await Slide.find(filter).sort(sort).limit(queryLimit).lean();

  const hasMoreInDir = docs.length > limit;
  if (hasMoreInDir) docs = docs.slice(0, limit);

  // Always return ASC order for UI simplicity
  const items = dir === "prev" ? docs.reverse() : docs;

  const first = items[0];
  const last = items[items.length - 1];

  // Compute prev/next existence more accurately by peeking around anchors
  const hasMorePrev = first ? await checkForMoreSlides(topicId, first.position, first._id, dir) : false;
  const hasMoreNext = last ? await checkForMoreSlides(topicId, last.position, last._id, dir) : false;

  res.json({
    items,
    nextCursor: last ? { cursorPos: last.position, cursorId: String(last._id) } : null,
    prevCursor: first ? { cursorPos: first.position, cursorId: String(first._id) } : null,
    hasMoreNext,
    hasMorePrev,
  });
});


router.get("/:topicId/slides:last-cursor", async (req, res) => {
  try {
    const topicId = new Types.ObjectId(req.params.topicId);
    const last = await Slide.findOne({ topicId }).sort({ position: -1, _id: -1 }).select({ position: 1 }).lean();
    if (!last) return res.json({ lastCursor: null });
    res.json({ lastCursor: { cursorPos: last.position, cursorId: String(last._id) } });
  } catch (err) {

    res.status(400).json({
      error: {
        code: "BadRequest", message: err instanceof Error ? err.message : err
      }
    });
  }
});
export default router;