import { EntityInfo } from '@libs/ui/business-base';
import { IFilterStructureEntityInfoOptions } from './filter-structure-interface';
import { BasicsSharedFilterStructureDataServiceManager } from '../services/filter-structure-data-service-manager.service';
import { IGridTreeConfiguration } from '@libs/ui/common';
import { BasicsSharedFilterStructureDataService } from '../services/basics-shared-filter-structure-data.service';
import { IEntityIdentification } from '@libs/platform/common';
import {
	ConstructionSystemCommonFilterConstructBehavioService
} from '../../../behaviors/construction-system-common-filter-construct-behavio.service';

export class BasicsSharedFilterStructureEntityInfoFactory<T extends IEntityIdentification> {
	public create(options: IFilterStructureEntityInfoOptions<T>): EntityInfo {
		return EntityInfo.create<T>({
			grid: {
				containerUuid: options.gridContainerUuid,
				title: options.gridTitle,
				treeConfiguration: ctx => {
					return {
						parent: function (entity: T) {
							const service = new BasicsSharedFilterStructureDataService(options.filterStructureDataServiceCreateContext);
							return service.parentOf(entity);
						},
						children: function (entity: T) {
							const service = new BasicsSharedFilterStructureDataService(options.filterStructureDataServiceCreateContext);
							return service.childrenOf(entity);
						}
					} as IGridTreeConfiguration<T>;
				},
				behavior: context => context.injector.get(ConstructionSystemCommonFilterConstructBehavioService<T>)
			},
			dataService: (ctx) => {
				return ctx.injector.get(BasicsSharedFilterStructureDataServiceManager).createDataServiceInstance(options.filterStructureDataServiceCreateContext, ctx);
			},

			dtoSchemeId: options.dtoSchemaId,
			permissionUuid: options.permissionUuid,
			layoutConfiguration: options.customizeLayoutConfiguration,

			prepareEntityContainer: (ctx) => {
				ctx.translateService.load('basics.common');
			},
		});
	}
}