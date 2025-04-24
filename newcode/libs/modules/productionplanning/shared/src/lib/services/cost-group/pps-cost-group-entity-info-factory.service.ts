import { IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { EntityDomainType, IEntitySelection } from '@libs/platform/data-access';
import { EntityInfo } from '@libs/ui/business-base';
import { IPpsCostGroupEntityInfoOptions } from '../../model/cost-group/pps-cost-group-entity-info-options.interface';
import { IPpsCostGroupEntity } from '../../model/cost-group/pps-cost-group.interface';
import { PpsCostGroupDataServiceManager } from './pps-cost-group-data-service-manager.service';
import { PpsCostGroupGridBehavior } from './pps-cost-group-grid-behavior.service';
import { PpsCostGroupLayoutService } from './pps-cost-group-layout.service';

export class PpsCostGroupEntityInfoFactory {
	public static create<PT extends IEntityIdentification>(options: IPpsCostGroupEntityInfoOptions<PT>): EntityInfo {
		const getDataSrv = (ctx: IInitializationContext) => PpsCostGroupDataServiceManager.getDataService(options, ctx);
		return EntityInfo.create<IPpsCostGroupEntity>({
			grid: {
				title: options.gridTitle ?? { key: 'productionplanning.common.costgroupListTitle', text: '*Cost Groups' },
				containerUuid: options.containerUuid,
				behavior: ctx => ctx.injector.get(PpsCostGroupGridBehavior)
			},
			dataService: ctx => getDataSrv(ctx) as IEntitySelection<IPpsCostGroupEntity>,
			entitySchema: {
				schema: 'IPpsCostGroupEntity', properties: {
					Code: { domain: EntityDomainType.Code, mandatory: false },
					DescriptionInfo: { domain: EntityDomainType.Translation, mandatory: false },
					CostGroupFk: { domain: EntityDomainType.Integer, mandatory: false },
				}
			},
			layoutConfiguration: (ctx) => ctx.injector.get(PpsCostGroupLayoutService).generateLayout(),
			permissionUuid: options.permissionUuid,
			prepareEntityContainer: async (ctx) => {
				await Promise.all([
					ctx.translateService.load([/*'cloud.common',*/ 'productionplanning.common']),
					// other promises...
				]);
			},

		});
	}

}