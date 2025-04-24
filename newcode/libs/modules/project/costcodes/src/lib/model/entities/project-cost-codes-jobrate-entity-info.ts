/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { EntityInfo } from '@libs/ui/business-base';
import { ProjectCostCodesJobRateDataService } from '../../services/project-cost-codes-job-rate-data.service';
import { ProjectCostCodesJobRateBehavior } from '../../behaviors/project-cost-codes-job-rate-behavior.service';
import { BasicsCostCodesJobRateLayoutService } from '../../services/project-cost-codes-job-rate-layout.service';
import { EntityDomainType } from '@libs/platform/data-access';

/**
 * Entity information for project cost codes job rate.
 */
export const PROJECT_COST_CODES_JOB_RATE_ENTITY_INFO = EntityInfo.create({

	grid: {
		title: { text: 'Project Cost Codes Job Rate' },
		behavior:ctx=>ctx.injector.get(ProjectCostCodesJobRateBehavior),
	},

	form: {
		title: { text: 'Cost Codes Job rate Details' },
		containerUuid: '0b75353e6eb94790a745035590538792',

	},
	// dtoSchemeId: {
	// 	moduleSubModule: 'Project.CostCodes',
	// 	typeName: 'ProjectCostCodesJobRateDto',
	// },
	entitySchema: {
		schema: 'ProjectCostCodesJobRateDto',
		properties: {
			BasFactorCosts: { domain: EntityDomainType.Factor, mandatory: false },
			FactorCosts: { domain: EntityDomainType.Factor, mandatory: false },
			BasRealFactorCosts: { domain: EntityDomainType.Factor, mandatory: false },
			RealFactorCosts: { domain: EntityDomainType.Factor, mandatory: false },
			BasFactorHour: { domain: EntityDomainType.Factor, mandatory: false },
			FactorHour: { domain: EntityDomainType.Factor, mandatory: false },
			BasFactorQuantity: { domain: EntityDomainType.Factor, mandatory: false },
			FactorQuantity: { domain: EntityDomainType.Factor, mandatory: false },
			BasRealFactorQuantity: { domain: EntityDomainType.Factor, mandatory: false },
			RealFactorQuantity: { domain: EntityDomainType.Factor, mandatory: false },
			BasRate: { domain: EntityDomainType.Money, mandatory: false },
			Rate: { domain: EntityDomainType.Money, mandatory: false },
			BasDayWorkRate: { domain: EntityDomainType.Money, mandatory: false },
			SalesPrice: { domain: EntityDomainType.Money, mandatory: false },
			BasCurrencyFk: { domain: EntityDomainType.Integer, mandatory: false },
			CurrencyFk: { domain: EntityDomainType.Integer, mandatory: false },
			Co2Source: { domain: EntityDomainType.Quantity, mandatory: false },
			Co2Project: { domain: EntityDomainType.Quantity, mandatory: false },
			Co2SourceFk: { domain: EntityDomainType.Integer, mandatory: false },
			LgmJobFk: { domain: EntityDomainType.Integer, mandatory: false },
		},
	},
	dataService: (ctx: IInitializationContext) => {
		return ctx.injector.get(ProjectCostCodesJobRateDataService);
	},
	permissionUuid: 'bba88645983a4c6fa26418f58ca85dbe',
	layoutConfiguration: context => {
        return context.injector.get(BasicsCostCodesJobRateLayoutService).generateConfig();
    }
});
