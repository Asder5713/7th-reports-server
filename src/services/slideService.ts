import mongoose from 'mongoose';
import Slide, { ISlide } from '../models/Slide';

export class SlideService {
  // Get all slides
  static async getAllSlides(): Promise<ISlide[]> {
    const slides = await Slide.find()
      .select('-__v')
      .sort({ position: 1, createdAt: -1 });
    await Promise.all(slides.map(slide => slide?.resolveFiles()));
    return slides;
  }

  // Get slide by ID
  static async getSlideById(id: string): Promise<ISlide | null> {
    const slide = await Slide.findById(id)
      .select('-__v');
    await slide?.resolveFiles();
    return slide;
  }

  // Create new slide
  static async createSlide(slideData: Partial<ISlide>): Promise<ISlide> {
    const slide = new Slide({
      content: slideData.content,
      inTopic: slideData.inTopic,
    });

    return await slide.save();
  }

  // Update slide
  static async updateSlide(id: string, updateData: Partial<ISlide>): Promise<ISlide | null> {
    return await Slide.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .select('-__v');
  }

  // Delete slide
  static async deleteSlide(id: string): Promise<ISlide | null> {
    return await Slide.findByIdAndDelete(id);
  }

  // Get slides by topic
  static async getSlidesByTopic(topicId: string, limit?: number, skip?: number): Promise<ISlide[]> {
    const query = Slide.find({ inTopic: topicId })
      .select('_id content position')
      .sort({ position: 1 });
    
    if (skip) {
      query.skip(skip);
    }
    
    if (limit) {
      query.limit(limit);
    }
    
    const slides = await query;
    await Promise.all(slides.map(slide => slide?.resolveFiles()));
    return slides;
  }

  static async getSlidesForInitialFetch(topicIds: mongoose.Types.ObjectId[]) {
    const slides: ISlide[] = await Slide.aggregate([
      {
        $facet: {
          firstTopic: [
            {
              $match: { inTopic: topicIds[0] }
            },
            {
              $sort: { position: 1 }
            },
            {
              $limit: parseInt(process.env.FIRST_TOPIC_SLIDE_LIMIT || '15')
            }
          ],
          otherTopics: [
            {
              $match: { inTopic: { $ne: topicIds[0] } }
            },
            {
              $sort: { position: 1 }
            },
            {
              $limit: parseInt(process.env.OTHER_TOPICS_SLIDE_LIMIT || '4')
            }
          ]
        }
      },
      {
        $project: {
          allResults: {
            $concatArrays: ['$firstTopic', '$otherTopics']
          }
        }
      },
      {
        $unwind: '$allResults'
      },
      {
        $group: {
          _id: '$allResults.inTopic',
          slides: { $push: { _id: '$allResults._id', content: '$allResults.content' } }
        }
      },
      {
        $project: {
          topicId: '$_id',
          slides: 1
        }
      }
    ]);

    await Promise.all(slides.map(slide => slide?.resolveFiles()));
    return slides;
  }
}

