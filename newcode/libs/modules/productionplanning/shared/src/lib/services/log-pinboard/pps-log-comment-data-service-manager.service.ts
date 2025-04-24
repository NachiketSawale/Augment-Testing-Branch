import { runInInjectionContext } from '@angular/core';
import { IEntityBase, IEntityIdentification, ServiceLocator } from '@libs/platform/common';
import { IPpsLogPinBoardContainerCreationOptions, ProductionplanningSharedLogCommentDataService } from './pps-log-comment-data.service';

export class ProductionplanningSharedLogPinBoardDataServiceManager {
	private static _dataServiceCache = new Map<string, object>();
	public static getDataService<T extends IEntityBase & IEntityIdentification, PT extends IEntityBase & IEntityIdentification>(
		options: IPpsLogPinBoardContainerCreationOptions<T, PT>,
	) {
		const key = options.uuid;
		let instance = this._dataServiceCache.get(key);
		if (!instance) {
			instance = runInInjectionContext(ServiceLocator.injector, () =>
				new ProductionplanningSharedLogCommentDataService<T, PT>(options)
			);
			this._dataServiceCache.set(key, instance);
		}
		return instance as ProductionplanningSharedLogCommentDataService<T, PT>;
	}
}