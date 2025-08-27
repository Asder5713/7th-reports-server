import { FilterQuery } from "mongoose";
import Slide, { ISlide } from "../models/Slide";

// Helper function to build the filter for the slides
export const buildFilter = (topicId: string, cursorPos: any, cursorId: string, dir: 'next' | 'prev'): FilterQuery<ISlide> => {
    let filter: FilterQuery<ISlide> = { topicId };
    if (cursorPos != null && cursorId) {
      if (dir === "next") {
        filter = {
          topicId,
          $or: [
            { position: { $gt: cursorPos } },
            { position: cursorPos, _id: { $gt: cursorId } },
          ],
        };
      } else {
        filter = {
          topicId,
          $or: [
            { position: { $lt: cursorPos } },
            { position: cursorPos, _id: { $lt: cursorId } },
          ],
        };
      }
    }
    return filter;
  };
  
  // Helper function to build the sort order based on direction
export const buildSort = (dir: 'next' | 'prev'): Record<string, 1 | -1> => {
    return dir === "next" ? { position: 1, _id: 1 } : { position: -1, _id: -1 };
  };
  
  // Function to get the next/previous existence more accurately
export const checkForMoreSlides = async (topicId: string, position: any, _id: string, dir: 'next' | 'prev') => {
    const filter = {
      topicId,
      $or: [
        { position: dir === 'next' ? { $gt: position } : { $lt: position } },
        { position, _id: dir === 'next' ? { $gt: _id } : { $lt: _id } },
      ],
    };
  
    return (await Slide.find(filter).sort({ position: dir === 'next' ? 1 : -1, _id: dir === 'next' ? 1 : -1 }).limit(1).lean()).length > 0;
  };
  