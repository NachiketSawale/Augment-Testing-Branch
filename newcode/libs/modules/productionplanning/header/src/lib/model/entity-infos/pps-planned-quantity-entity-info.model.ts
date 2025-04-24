
/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { IGridTreeConfiguration } from '@libs/ui/common';
import { IPpsPlannedQuantityEntity } from '@libs/productionplanning/formulaconfiguration';
import { PpsHeaderPlannedQuantityDataService } from '../../services/pps-header-planned-quantity-data.service';
import { PpsHeaderPlannedQuantityValidationService } from '../../services/pps-header-planned-quantity-validation.service';
import { PpsPlannedQuantityLayoutService } from '../../services/layouts/pps-planned-quantity-layout.service';
import { PpsPlannedQuantityStructureBehavior } from '../../behaviors/pps-planned-quantity-structure-behavior.service';

export const PPS_PLANNED_QUANTITY_ENTITY_INFO = EntityInfo.create<IPpsPlannedQuantityEntity>({
	grid: {
		title: { text: '*PPS Header:Planned Quantity', key: 'productionplanning.header.plannedQuantityListTitle' },
		behavior: ctx => ctx.injector.get(PpsPlannedQuantityStructureBehavior),
		containerUuid: 'e3c70e91bc5546969da39896d9c72028',
		treeConfiguration: ctx => {
			return {
				parent: function (entity: IPpsPlannedQuantityEntity) {
					const service = ctx.injector.get(PpsHeaderPlannedQuantityDataService);
					return service.parentOf(entity);
				},
				children: function (entity: IPpsPlannedQuantityEntity) {
					const service = ctx.injector.get(PpsHeaderPlannedQuantityDataService);
					return service.childrenOf(entity);
				}
			} as IGridTreeConfiguration<IPpsPlannedQuantityEntity>;
		}
	},
	dataService: (ctx) => ctx.injector.get(PpsHeaderPlannedQuantityDataService),
	validationService: (ctx) => ctx.injector.get(PpsHeaderPlannedQuantityValidationService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.FormulaConfiguration', typeName: 'PpsPlannedQuantityDto' },
	permissionUuid: 'e3c70e91bc5546969da39896d9c72028',
	layoutConfiguration: context => {
		return context.injector.get(PpsPlannedQuantityLayoutService).generateLayout(context);
	}
});

