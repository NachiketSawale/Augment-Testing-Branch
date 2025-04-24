import { runInInjectionContext } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import { IEntityRuntimeDataRegistry, IEntitySelection } from '@libs/platform/data-access';
import { IProjectMainPrj2BPContactEntity, IProjectMainPrj2BusinessPartnerEntity } from '@libs/project/interfaces';
import { PpsCommonPrj2bpcontactDataService } from './pps-common-prj2bpcontact-data.service';

export class PpsCommonPrj2bpcontactDataServiceManager {

	private static _dataServiceCache = new Map<string, IEntitySelection<IProjectMainPrj2BPContactEntity> | IEntityRuntimeDataRegistry<IProjectMainPrj2BPContactEntity>>();

	public static getDataService(
		options: {
			parentServiceFn: (context: IInitializationContext) => IEntitySelection<IProjectMainPrj2BusinessPartnerEntity>,
			containerUuid: string;
		},
		context: IInitializationContext,
	) {
		const key = options.containerUuid;

		let instance = PpsCommonPrj2bpcontactDataServiceManager._dataServiceCache.get(key);
		if (!instance) {
			instance = runInInjectionContext(context.injector, () => new PpsCommonPrj2bpcontactDataService(options.parentServiceFn(context)));
			PpsCommonPrj2bpcontactDataServiceManager._dataServiceCache.set(key, instance);
		}
		return instance;
	}
}