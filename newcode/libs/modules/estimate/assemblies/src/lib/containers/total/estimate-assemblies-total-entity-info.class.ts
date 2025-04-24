/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { IEstCostTotalEntity } from '@libs/estimate/interfaces';
import { EntityDomainType } from '@libs/platform/data-access';
import { EstimateAssembliesTotalDataService } from './estimate-assemblies-total-data.service';
import { EstimateAssembliesTotalLayoutService } from './estimate-assemblies-total-layout.service';
import { EstimateAssembliesTotalBehavior } from './estimate-assemblies-total-behavior.service';

/**
 * Estimate Total Entity Info
 */
export const ESTIMATE_ASSEMBLIES_TOTAL_ENTITY_INFO = EntityInfo.create<IEstCostTotalEntity>({
	grid: {
		title: { text: 'Total', key: 'estimate.main.totalContainer' },
		containerUuid: '0DC8F53C3E9343C388C466AC1D2884A5',
	},
	dataService: (ctx) => ctx.injector.get(EstimateAssembliesTotalDataService),
	entitySchema: {
		schema: 'IEstAssembliesTotalData',
		properties: {
			DescriptionInfo: { domain: EntityDomainType.Description, mandatory: false },
			QuantityTotal: { domain: EntityDomainType.Decimal, mandatory: false },
			UoM: { domain: EntityDomainType.Description, mandatory: false },
			CostTotal: { domain: EntityDomainType.Decimal, mandatory: false },
			Currency: { domain: EntityDomainType.Description, mandatory: false },
		},
	},
	permissionUuid: '681223e37d524ce0b9bfa2294e18d650',
	layoutConfiguration: (ctx) => ctx.injector.get(EstimateAssembliesTotalLayoutService).generateLayout(),
	containerBehavior: (ctx) => ctx.injector.get(EstimateAssembliesTotalBehavior),
});
