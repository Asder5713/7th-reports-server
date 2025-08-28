import Slide, { ISlide } from '../models/Slide';

export class SlideService {
  // Get all slides
  static async getAllSlides(): Promise<ISlide[]> {
    return await Slide.find()
      .select('-__v')
      .sort({ position: 1, createdAt: -1 });
  }

  // Get slide by ID
  static async getSlideById(id: string): Promise<ISlide | null> {
    return await Slide.findById(id)
      .select('-__v');
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
      .select('-__v')
      .sort({ position: 1 });
    
    if (skip) {
      query.skip(skip);
    }
    
    if (limit) {
      query.limit(limit);
    }
    
    return await query;
  }

  static async getSlidesForInitialFetch(topicIds: string[]) {
    const slidesResult = await Slide.aggregate([
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
          slides: { $push: '$allResults' }
        }
      },
      {
        $project: {
          topicId: '$_id',
          slides: 1
        }
      }
    ]);

    return slidesResult;
  }
}

