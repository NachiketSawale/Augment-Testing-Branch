import { runInInjectionContext } from '@angular/core';
import { IPinBoardContainerCreationOptions } from '@libs/basics/shared';
import { IEntityBase, IEntityIdentification, ServiceLocator } from '@libs/platform/common';
import { ProductionplanningSharedJobCommentDataService } from './pps-job-comment-data.service';

export class ProductionplanningSharedJobPinBoardDataServiceManager {
	private static _dataServiceCache = new Map<string, object>();
	public static getDataService<T extends IEntityBase & IEntityIdentification, PT extends IEntityBase & IEntityIdentification>(
		options: IPinBoardContainerCreationOptions<T, PT>,
	) {
		const key = options.uuid;
		let instance = this._dataServiceCache.get(key);
		if (!instance) {
			instance = runInInjectionContext(ServiceLocator.injector, () =>
				new ProductionplanningSharedJobCommentDataService<T, PT>(options)
			);
			this._dataServiceCache.set(key, instance);
		}
		return instance as ProductionplanningSharedJobCommentDataService<T, PT>;
	}
}