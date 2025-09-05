import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Document } from 'mongoose';
import { Activity } from './activity.schema';
import { CreateActivityInput } from './activity.inputs.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name)
    private activityModel: Model<Activity>,
  ) {}

  async findAll(): Promise<Activity[]> {
    return this.activityModel.find().sort({ createdAt: -1 }).exec();
  }

  async findLatest(): Promise<Activity[]> {
    return this.activityModel.find().sort({ createdAt: -1 }).limit(3).exec();
  }

  async findByUser(userId: string): Promise<Activity[]> {
    return this.activityModel
      .find({ owner: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Activity> {
    const activity = await this.activityModel.findById(id).exec();
    if (!activity) throw new NotFoundException();
    return activity;
  }

  async findByIds(ids: string[]): Promise<Activity[]> {
    return this.activityModel.find({ _id: { $in: ids } }).exec();
  }

  async create(userId: string, data: CreateActivityInput): Promise<Activity> {
    const activity = await this.activityModel.create({
      ...data,
      owner: userId,
    });
    return activity;
  }

  async findCities(): Promise<string[]> {
    return this.activityModel.distinct('city').exec();
  }

  async findByCity(
    city: string,
    activity?: string,
    price?: number,
  ): Promise<Activity[]> {
    return this.activityModel
      .find({
        $and: [
          { city },
          ...(price ? [{ price }] : []),
          ...(activity ? [{ name: { $regex: activity, $options: 'i' } }] : []),
        ],
      })
      .exec();
  }

  async countDocuments(): Promise<number> {
    return this.activityModel.estimatedDocumentCount().exec();
  }

async getActivitiesByIds(ids: string[]): Promise<Activity[]> {
  const activities = await this.activityModel.find({ _id: { $in: ids } }).exec();
  const activityMap = new Map(activities.map(a => [a.id.toString(), a]));

  return ids
  .map(id => activityMap.get(id))
  .filter(
    (a): a is Document & Activity & { _id: Types.ObjectId } =>
      Boolean(a)
  ); // filtre + cast
}
}
