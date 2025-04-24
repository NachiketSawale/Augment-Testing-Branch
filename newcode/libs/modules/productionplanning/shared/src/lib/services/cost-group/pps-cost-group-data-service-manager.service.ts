import { runInInjectionContext } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import { IEntityRuntimeDataRegistry, IEntitySelection } from '@libs/platform/data-access';
import { IPpsCostGroupEntity } from '../../model/cost-group/pps-cost-group.interface';
import { IPpsCostGroupEntityInfoOptions } from '../../model/cost-group/pps-cost-group-entity-info-options.interface';
import { PpsCostGroupDataService } from './pps-cost-group-data.service';

export class PpsCostGroupDataServiceManager {

	private static _dataServiceCache = new Map<string, IEntitySelection<IPpsCostGroupEntity> | IEntityRuntimeDataRegistry<IPpsCostGroupEntity>>();

	public static getDataService<PT extends object/*, PU extends object*/>(
		options: IPpsCostGroupEntityInfoOptions<PT>,
		context: IInitializationContext,
	) {
		const key = options.containerUuid;

		let instance = PpsCostGroupDataServiceManager._dataServiceCache.get(key);
		if (!instance) {
			instance = runInInjectionContext(context.injector, () => new PpsCostGroupDataService(options.parentServiceFn(context), options));
			PpsCostGroupDataServiceManager._dataServiceCache.set(key, instance);
		}
		return instance;
	}
}