import { runInInjectionContext } from '@angular/core';
import { IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { IEntityRuntimeDataRegistry, IEntitySelection } from '@libs/platform/data-access';
import { IProjectMainPrj2BusinessPartnerEntity } from '@libs/project/interfaces';
import { IPpsCommonPrj2bpEntityInfoOptions } from '../../model/pps-common-prj2bp-entity-info-options.interface';
import { PpsCommonPrj2bpDataService } from './pps-common-prj2bp-data.service';

export class PpsCommonPrj2bpDataServiceManager {

	private static _dataServiceCache = new Map<string, IEntitySelection<IProjectMainPrj2BusinessPartnerEntity> | IEntityRuntimeDataRegistry<IProjectMainPrj2BusinessPartnerEntity>>();

	public static getDataService<PT extends IEntityIdentification/*, PU extends object*/>(
		options: IPpsCommonPrj2bpEntityInfoOptions<PT>,
		context: IInitializationContext,
	) {
		const key = options.containerUuid;

		let instance = PpsCommonPrj2bpDataServiceManager._dataServiceCache.get(key);
		if (!instance) {
			instance = runInInjectionContext(context.injector, () => new PpsCommonPrj2bpDataService(options.parentServiceFn(context), options.projectFkField));
			PpsCommonPrj2bpDataServiceManager._dataServiceCache.set(key, instance);
		}
		return instance;
	}
}