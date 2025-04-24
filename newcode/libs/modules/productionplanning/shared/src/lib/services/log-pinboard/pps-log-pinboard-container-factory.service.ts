import { CommentType, PinBoardContainerFactory } from '@libs/basics/shared';
import { EntityBase, IEntityIdentification } from '@libs/platform/common';
import { ProductionplanningSharedLogPinBoardDataServiceManager } from './pps-log-comment-data-service-manager.service';
import { IPpsLogPinBoardContainerCreationOptions } from './pps-log-comment-data.service';

export class ProductionplanningSharedLogPinBoardContainerFactory {
	public static create<T extends IEntityIdentification & EntityBase, PT extends IEntityIdentification & EntityBase>
		(logPinBoardOptions: IPpsLogPinBoardContainerCreationOptions<T, PT>) {
		return PinBoardContainerFactory.create({
			dataService: ProductionplanningSharedLogPinBoardDataServiceManager.getDataService(logPinBoardOptions),
			commentType: logPinBoardOptions.commentType ?? CommentType.Standard,
			permission: logPinBoardOptions.permission,
			showLastComments: logPinBoardOptions.showLastComments ?? true,
			title: logPinBoardOptions.title,
			...logPinBoardOptions
		});
	}
}
