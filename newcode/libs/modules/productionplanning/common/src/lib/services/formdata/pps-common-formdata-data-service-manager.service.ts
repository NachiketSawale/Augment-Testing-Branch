import { runInInjectionContext } from '@angular/core';
import { IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { IEntityRuntimeDataRegistry, IEntitySelection } from '@libs/platform/data-access';
import { IPpsUserFormDataEntity } from '../../model/entities/pps-formdata-entity.interface';
import { IPpsFormdataEntityInfoOptions } from '../../model/pps-common-formdata-entity-info-options.interface';
import { PpsCommonFormdataDataService } from './pps-common-formdata-data.service';

export class PpsFormdataDataServiceManager {

	private static _dataServiceCache = new Map<string, IEntitySelection<IPpsUserFormDataEntity> | IEntityRuntimeDataRegistry<IPpsUserFormDataEntity>>();

	public static getDataService<PT extends IEntityIdentification/*, PU extends object*/>(
		options: IPpsFormdataEntityInfoOptions<PT>,
		context: IInitializationContext,
	) {
		const key = options.containerUuid;

		let instance = PpsFormdataDataServiceManager._dataServiceCache.get(key);
		if (!instance) {
			instance = runInInjectionContext(context.injector, () => new PpsCommonFormdataDataService(options.parentServiceFn(context), options));
			PpsFormdataDataServiceManager._dataServiceCache.set(key, instance);
		}
		return instance;
	}
}