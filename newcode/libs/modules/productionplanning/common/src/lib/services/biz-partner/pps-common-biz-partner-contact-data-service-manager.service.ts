import { runInInjectionContext } from '@angular/core';
import { IInitializationContext } from '@libs/platform/common';
import { IEntityRuntimeDataRegistry, IEntitySelection } from '@libs/platform/data-access';
import { IPpsCommonBizPartnerContactEntity } from '../../model/entities/pps-common-biz-partner-contact-entity.interface';
import { IPpsCommonBizPartnerEntity } from '../../model/entities/pps-common-biz-partner-entity.interface';
import { PpsCommonBizPartnerContactDataService } from './pps-common-biz-partner-contact-data.service';

export class PpsCommonBizPartnerContactDataServiceManager {

	private static _dataServiceCache = new Map<string, IEntitySelection<IPpsCommonBizPartnerContactEntity> | IEntityRuntimeDataRegistry<IPpsCommonBizPartnerContactEntity>>();

	// public static getDataService<PT extends IEntityIdentification/*, PU extends object*/>(
	// public static getDataService<PT extends IPpsCommonBizPartnerEntity/*, PU extends object*/>(
	public static getDataService(
		options: {
			parentServiceFn: (context: IInitializationContext) => IEntitySelection<IPpsCommonBizPartnerEntity>,
			// parentServiceFn: (context: IInitializationContext) => IEntitySelection<PT>,
			containerUuid: string;
		},
		context: IInitializationContext,
	) {
		const key = options.containerUuid;

		let instance = PpsCommonBizPartnerContactDataServiceManager._dataServiceCache.get(key);
		if (!instance) {
			instance = runInInjectionContext(context.injector, () => new PpsCommonBizPartnerContactDataService(
				options.parentServiceFn(context)/*, options*/
			));
			PpsCommonBizPartnerContactDataServiceManager._dataServiceCache.set(key, instance);
		}
		return instance;
	}
}