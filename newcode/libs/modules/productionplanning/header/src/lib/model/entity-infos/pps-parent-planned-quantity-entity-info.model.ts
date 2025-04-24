
/*
 * Copyright(c) RIB Software GmbH
 */
import { IPpsPlannedQuantityEntity } from '@libs/productionplanning/formulaconfiguration';
import { EntityInfo } from '@libs/ui/business-base';
import { PpsHeaderParentPlannedQuantityDataService } from '../../services/pps-header-parent-planned-quantity-data.service';
import { PpsHeaderParentPlannedQuantityValidationService } from '../../services/pps-header-parent-planned-quantity-validation.service';
import { PpsPlannedQuantityLayoutService } from '../../services/layouts/pps-planned-quantity-layout.service';
import { PpsPlannedQuantityGridBehavior } from '../../behaviors/pps-planned-quantity-grid-behavior.service';
export const PPS_PARENT_PLANNED_QUANTITY_ENTITY_INFO = EntityInfo.create<IPpsPlannedQuantityEntity>({
	grid: {
		title: { text: '*PPS Header:Parent Planned Quantity', key: 'productionplanning.header.parentPlannedQuantityListTitle' },
		behavior: ctx => ctx.injector.get(PpsPlannedQuantityGridBehavior),
		containerUuid: '8799d0784da24cb3a94ff9ba671a93d9',
	},
	dataService: (ctx) => ctx.injector.get(PpsHeaderParentPlannedQuantityDataService),
	validationService: (ctx) => ctx.injector.get(PpsHeaderParentPlannedQuantityValidationService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.FormulaConfiguration', typeName: 'PpsPlannedQuantityDto' },
	permissionUuid: 'e3c70e91bc5546969da39896d9c72028',
	layoutConfiguration: context => {
		return context.injector.get(PpsPlannedQuantityLayoutService).generateLayout(context);
	}
});
