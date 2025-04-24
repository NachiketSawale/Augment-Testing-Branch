import { CommentType, IPinBoardContainerCreationOptions, PinBoardContainerFactory } from '@libs/basics/shared';
import { EntityBase, IEntityIdentification } from '@libs/platform/common';
import { ProductionplanningSharedJobPinBoardDataServiceManager } from './pps-job-comment-data-service-manager.service';

export class ProductionplanningSharedJobPinBoardContainerFactory {
	public static create<T extends IEntityIdentification & EntityBase, PT extends IEntityIdentification & EntityBase>
		(jobPinBoardOptions: IPinBoardContainerCreationOptions<T, PT>) {
		return PinBoardContainerFactory.create({
			dataService: ProductionplanningSharedJobPinBoardDataServiceManager.getDataService(jobPinBoardOptions),
			commentType: jobPinBoardOptions.commentType ?? CommentType.Standard,
			permission: jobPinBoardOptions.permission ?? 'f7a4c2016e614d21834c50e44c6a65dd',
			showLastComments: jobPinBoardOptions.showLastComments ?? true,
			title: jobPinBoardOptions.title ?? 'productionplanning.common.jobCommentContainerTitle',
			...jobPinBoardOptions
		});
	}
}
