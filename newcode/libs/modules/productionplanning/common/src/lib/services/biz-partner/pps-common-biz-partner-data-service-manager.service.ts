import { runInInjectionContext } from '@angular/core';
import { IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { IEntityRuntimeDataRegistry, IEntitySelection } from '@libs/platform/data-access';
import { IPpsCommonBizPartnerEntity } from '../../model/entities/pps-common-biz-partner-entity.interface';
import { IPpsCommonBizPartnerEntityInfoOptions } from '../../model/pps-common-biz-partner-entity-info-options.interface';
import { PpsCommonBizPartnerDataService } from './pps-common-biz-partner-data.service';

export class PpsCommonBizPartnerDataServiceManager {

	private static _dataServiceCache = new Map<string, IEntitySelection<IPpsCommonBizPartnerEntity> | IEntityRuntimeDataRegistry<IPpsCommonBizPartnerEntity>>();

	public static getDataService<PT extends IEntityIdentification/*, PU extends object*/>(
		options: IPpsCommonBizPartnerEntityInfoOptions<PT>,
		context: IInitializationContext,
	) {
		const key = options.containerUuid;

		let instance = PpsCommonBizPartnerDataServiceManager._dataServiceCache.get(key);
		if (!instance) {
			instance = runInInjectionContext(context.injector, () => new PpsCommonBizPartnerDataService(options.parentServiceFn(context), options));
			PpsCommonBizPartnerDataServiceManager._dataServiceCache.set(key, instance);
		}
		return instance;
	}
}