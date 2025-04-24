import { EntityInfo } from '@libs/ui/business-base';
import { IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { IPpsEntityInfoOptions } from '@libs/productionplanning/shared';
import { PpsUpstreamItemDataServiceManager } from './pps-upstream-item-data-service-manager.service';
import { IPpsUpstreamItemEntity } from '../../model/models';
import { PpsUpstreamItemLayoutService } from './pps-upstream-item-layout.service';
import { PpsUpstreamItemBehaviorService } from './pps-upstream-item-behavior.service';
import { PpsUpstreamItemValidationService } from './pps-upstream-item-validation.service';
import { runInInjectionContext } from '@angular/core';

export interface IPpsUpstreamItemInfoOptions<PT extends object> extends IPpsEntityInfoOptions<PT> {
	endPoint?: string,
	mainItemColumn?: string;
	ppsHeaderColumn?: string;
	ppsItemColumn?: string;
	deleteSupported?: boolean, // for spltUpstreamItem container, its value should be false
	createSupported?: boolean, // for spltUpstreamItem container, its value should be false
	copySupported?: boolean, // for spltUpstreamItem container, its value should be false
	filterSupported?: boolean, // for spltUpstreamItem container, its value should be false
	splitSupported?: boolean, // for spltUpstreamItem container, its value should be false
}

export class PpsUpstreamItemEntityInfoFactory {
	public static create<PT extends IEntityIdentification>(options: IPpsUpstreamItemInfoOptions<PT>): EntityInfo {

		const getDataSrv = (ctx: IInitializationContext) => PpsUpstreamItemDataServiceManager.getDataService<PT>({
			...options
		}, ctx);
		const toolbarOptions = {
			copySupported: options.copySupported,
			filterSupported: options.filterSupported,
			splitSupported: options.splitSupported,
		};
		return EntityInfo.create<IPpsUpstreamItemEntity>({
			grid: {
				title: options.gridTitle,
				containerUuid: options.containerUuid,
				behavior: ctx => new PpsUpstreamItemBehaviorService(getDataSrv(ctx), toolbarOptions),
			},
			dataService: getDataSrv,
			validationService: (ctx) => runInInjectionContext(ctx.injector, () => new PpsUpstreamItemValidationService(getDataSrv(ctx))),
			dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Item', typeName: 'PpsUpstreamItemDto' },
			layoutConfiguration: ctx => ctx.injector.get(PpsUpstreamItemLayoutService).generateLayout(),
			permissionUuid: options.permissionUuid,
			prepareEntityContainer: async (ctx) => {
				await Promise.all([
					ctx.translateService.load(['productionplanning.common', 'productionplanning.item']),
					// other promises...
				]);
			},

		});
	}

}