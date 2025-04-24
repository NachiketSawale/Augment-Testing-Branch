import { runInInjectionContext } from '@angular/core';
import { IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';
import { IPpsHeaderEntity } from '../../model/header/pps-header-entity.interface';
import { ProductionplanningSharedPpsHeaderDataService } from './pps-header-data-service';

export class ProductionplanningSharedPpsHeaderEntityDataServiceManager {

	private static _dataServiceCache = new Map<string, IEntitySelection<IPpsHeaderEntity>>();

	public static getDataService<PT extends IEntityIdentification/*, PU extends object*/>(
		options: {
			parentServiceFn: (context: IInitializationContext) => IEntitySelection<PT>,
			containerUuid: string,
			foreignKey: string, // PrjProjectFk or OrdHeaderFk
		},
		context: IInitializationContext,
	) {
		const key = options.containerUuid;

		let instance = ProductionplanningSharedPpsHeaderEntityDataServiceManager._dataServiceCache.get(key);
		if (!instance) {
			instance = runInInjectionContext(context.injector, () => new ProductionplanningSharedPpsHeaderDataService(
				options.parentServiceFn(context), options.foreignKey
			));
			ProductionplanningSharedPpsHeaderEntityDataServiceManager._dataServiceCache.set(key, instance);
		}
		return instance;
	}
}