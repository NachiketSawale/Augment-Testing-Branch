import { IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';
import { EntityInfo } from '@libs/ui/business-base';
import { IPpsHeaderEntity } from '../../model/header/pps-header-entity.interface';
import { ProductionplanningSharedPpsHeaderEntityDataServiceManager } from './pps-header-data-service-manager.service';
import { PpsHeaderGridBehavior } from './pps-header-grid-behavior.service';
import { PpsHeaderLayoutService } from './pps-header-layout.service';
import { isEmpty } from 'lodash';

export class ProductionplanningSharedPpsHeaderEntityInfoFactory {
	public static create<PT extends IEntityIdentification>(options: {
		parentServiceFn: (context: IInitializationContext) => IEntitySelection<PT>,
		containerUuid: string,
		formContainerUuid?: string,
		permissionUuid: string,
		foreignKey: string, // PrjProjectFk or OrdHeaderFk
	}): EntityInfo {
		return EntityInfo.create<IPpsHeaderEntity>({
			grid: {
				title: { key: 'productionplanning.common.header.listTitle', text: '*PPS Header' },
				behavior: ctx => ctx.injector.get(PpsHeaderGridBehavior)
			},
			form: isEmpty(options.formContainerUuid)
				? undefined :
				{
					title: { key: 'productionplanning.common.header.detailTitle', text: '*PPS Header Details' },
					containerUuid: options.formContainerUuid ?? ''
				}
			,
			dataService: (ctx) => {
				return ProductionplanningSharedPpsHeaderEntityDataServiceManager.getDataService<PT>(options, ctx);
			},
			dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Header', typeName: 'HeaderDto' },
			layoutConfiguration: async ctx => ctx.injector.get(PpsHeaderLayoutService).generateLayout(ctx),
			permissionUuid: options.permissionUuid,
			prepareEntityContainer: async (ctx) => {
				await Promise.all([
					ctx.translateService.load(['basics.customize', 'productionplanning.common', 'productionplanning.engineering', 'productionplanning.header']),
					// other promises...
				]);
			},
		});
	}
}
