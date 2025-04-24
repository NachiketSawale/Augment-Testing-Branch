import { IEntitySelection } from '@libs/platform/data-access';
import { runInInjectionContext } from '@angular/core';
import { IInitializationContext, IEntityIdentification } from '@libs/platform/common';
import { IPpsUpstreamItemDataService, PpsUpstreamItemDataService } from './pps-upstream-item-data.service';

export class PpsUpstreamItemDataServiceManager {

	private static _dataServiceCache = new Map<string, IPpsUpstreamItemDataService>();

	public static getDataService<PT extends IEntityIdentification/*, PU extends object*/>(
		options: {
			containerUuid: string;
			endPoint?: string,
			mainItemColumn?: string, // e.g. 'Id'
			ppsHeaderColumn?: string, // e.g. 'PPSHeaderFk'
			ppsItemColumn?: string, // e.g. 'Id'
			parentServiceFn: (context: IInitializationContext) => IEntitySelection<PT>,

		},
		context: IInitializationContext,
	) {
		const key = options.containerUuid;

		let instance = PpsUpstreamItemDataServiceManager._dataServiceCache.get(key);
		if (!instance) {
			instance = runInInjectionContext(context.injector, () => new PpsUpstreamItemDataService(
				{
					parentService: options.parentServiceFn(context),
					...options
				}));
			PpsUpstreamItemDataServiceManager._dataServiceCache.set(key, instance);
		}
		return instance;
	}
}