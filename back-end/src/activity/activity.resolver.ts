import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  Int,
  Parent,
  ResolveField,
  ID,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from 'src/user/user.service';
import { Activity } from './activity.schema';

import { CreateActivityInput } from './activity.inputs.dto';
import { User } from 'src/user/user.schema';
import { ContextWithJWTPayload } from 'src/auth/types/context';

@Resolver(() => Activity)
export class ActivityResolver {
  constructor(
    private readonly activityService: ActivityService,
    private readonly userService: UserService,
  ) {}

  @ResolveField(() => ID)
  id(@Parent() activity: Activity): string {
    return activity._id.toString();
  }

  @ResolveField(() => User)
  async owner(@Parent() activity: Activity): Promise<User> {
    await activity.populate('owner');
    return activity.owner;
  }

  @Query(() => [Activity])
  async getActivities(): Promise<Activity[]> {
    return this.activityService.findAll();
  }

  @Query(() => [Activity])
  async getLatestActivities(): Promise<Activity[]> {
    return this.activityService.findLatest();
  }

  @Query(() => [Activity])
  @UseGuards(AuthGuard)
  async getActivitiesByUser(
    @Context() context: ContextWithJWTPayload,
  ): Promise<Activity[]> {
    return this.activityService.findByUser(context.jwtPayload.id);
  }

  @Query(() => [String])
  async getCities(): Promise<string[]> {
    const cities = await this.activityService.findCities();
    return cities;
  }

  @Query(() => [Activity])
  async getActivitiesByCity(
    @Args('city') city: string,
    @Args({ name: 'activity', nullable: true }) activity?: string,
    @Args({ name: 'price', nullable: true, type: () => Int }) price?: number,
  ): Promise<Activity[]> {
    return this.activityService.findByCity(city, activity, price);
  }

  @Query(() => Activity)
  async getActivity(@Args('id') id: string): Promise<Activity> {
    return this.activityService.findOne(id);
  }

  @Mutation(() => Activity)
  @UseGuards(AuthGuard)
  async createActivity(
    @Context() context: ContextWithJWTPayload,
    @Args('createActivityInput') createActivity: CreateActivityInput,
  ): Promise<Activity> {
    return this.activityService.create(context.jwtPayload.id, createActivity);
  }

  @Mutation(() => [Activity])
  @UseGuards(AuthGuard)
  async addFavoriteActivity(
    @Context() context: ContextWithJWTPayload,
    @Args('activityId') activityId: string,
  ): Promise<Activity[]> {
    const favoritesIds = await this.userService.addFavorite(context.jwtPayload.id, activityId);
    return this.activityService.getActivitiesByIds(favoritesIds);
  }

  @Mutation(() => [Activity])
  @UseGuards(AuthGuard)
  async removeFavoriteActivity(
    @Context() context: ContextWithJWTPayload,
    @Args('activityId') activityId: string,
  ): Promise<Activity[]> {
    const favoritesIds = await this.userService.removeFavorite(context.jwtPayload.id, activityId);
    return this.activityService.getActivitiesByIds(favoritesIds);
  }

  @Mutation(() => [Activity])
  @UseGuards(AuthGuard)
  async reorderFavoriteActivities(
    @Context() context: ContextWithJWTPayload,
    @Args({ name: 'newOrder', type: () => [String] }) newOrder: string[],
  ): Promise<Activity[]> {
    const favoritesIds = await this.userService.reorderFavorites(context.jwtPayload.id, newOrder);
    return this.activityService.getActivitiesByIds(favoritesIds);
  }

  @Query(() => [Activity])
  @UseGuards(AuthGuard)
  async getFavoriteActivities(   
    @Context() context: ContextWithJWTPayload,
  ): Promise<Activity[]> {
    const user = await this.userService.getById(context.jwtPayload.id);
    return this.activityService.getActivitiesByIds(user.favorites.map(fav => fav.toString()));
  }
}
