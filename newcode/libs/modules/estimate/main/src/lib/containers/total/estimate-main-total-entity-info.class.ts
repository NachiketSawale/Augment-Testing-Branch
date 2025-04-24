/*
 * Copyright(c) RIB Software GmbH
 */
import { CompositeGridConfigurationToken, CompositeGridContainerComponent, EntityInfo } from '@libs/ui/business-base';
import { TotalConfigTitleComponent } from '../../components/total/total-config-title/total-config-title.component';
import { EstimateMainTotalDataService, EstimateMainTotalDataServiceToken } from './estimate-main-total-data.service';
import { IEstCostTotalEntity } from '@libs/estimate/interfaces';
import { EstimateMainTotalLayoutService } from './estimate-main-total-layout.service';
import { EstimateMainTotalBehavior } from './estimate-main-total-behavior.service';
import { EntityDomainType } from '@libs/platform/data-access';

/**
 * Estimate Total Entity Info
 */
export const ESTIMATE_MAIN_TOTAL_ENTITY_INFO = EntityInfo.create<IEstCostTotalEntity>({
	grid: {
		title: { text: 'Total', key: 'estimate.main.totalContainer' },
		containerUuid: '07B7499A1F314F16A94EDDDC540C55D4',
		containerType: CompositeGridContainerComponent,
		providers: (ctx) => [
			{
				provide: CompositeGridConfigurationToken,
				useValue: {
					maxTopLeftLength: 50,
					topLeftContainerType: TotalConfigTitleComponent,
					providers: [
						{
							provide: EstimateMainTotalDataServiceToken,
							useValue: ctx.injector.get(EstimateMainTotalDataService),
						},
					],
				},
			},
		],
	},
	dataService: (ctx) => ctx.injector.get(EstimateMainTotalDataService),
	entitySchema: {
		schema: 'IEstMainConfigTotalData',
		properties: {
			//TODO
			// unfinished dynamic column
			DescriptionInfo: { domain: EntityDomainType.Description, mandatory: false },
			Quantity: { domain: EntityDomainType.Decimal, mandatory: false },
			AQDayWorkRateTotal: { domain: EntityDomainType.Decimal, mandatory: false },
			WQDayWorkRateTotal: { domain: EntityDomainType.Decimal, mandatory: false },
			UoM: { domain: EntityDomainType.Description, mandatory: false },
			Total: { domain: EntityDomainType.Decimal, mandatory: false },
			Currency: { domain: EntityDomainType.Description, mandatory: false },
			AQCostTotal: { domain: EntityDomainType.Decimal, mandatory: false },
			AQBudget: { domain: EntityDomainType.Decimal, mandatory: false },
			AQRevenue: { domain: EntityDomainType.Decimal, mandatory: false },
			AQMargin: { domain: EntityDomainType.Decimal, mandatory: false },
			WQCostTotal: { domain: EntityDomainType.Decimal, mandatory: false },
			WQBudget: { domain: EntityDomainType.Decimal, mandatory: false },
			WQRevenue: { domain: EntityDomainType.Decimal, mandatory: false },
			WQMargin: { domain: EntityDomainType.Decimal, mandatory: false },
			CostExchangeRate1: { domain: EntityDomainType.Decimal, mandatory: false },
			CostExchangeRate2: { domain: EntityDomainType.Decimal, mandatory: false },
			Currency1Fk: { domain: EntityDomainType.Integer, mandatory: false },
			Currency2Fk: { domain: EntityDomainType.Integer, mandatory: false },
			ForeignBudget1: { domain: EntityDomainType.Decimal, mandatory: false },
			ForeignBudget2: { domain: EntityDomainType.Decimal, mandatory: false },
			RiskCostTotal: { domain: EntityDomainType.Decimal, mandatory: false },
			EscalationCostTotal: { domain: EntityDomainType.Decimal, mandatory: false },
			GrandTotal: { domain: EntityDomainType.Decimal, mandatory: false },
			FromDJC: { domain: EntityDomainType.Decimal, mandatory: false },
			FromTJC: { domain: EntityDomainType.Decimal, mandatory: false },
			CO2SourceTotal: { domain: EntityDomainType.Decimal, mandatory: false },
			CO2ProjectTotal: { domain: EntityDomainType.Decimal, mandatory: false }
		},
	},
	permissionUuid: '681223e37d524ce0b9bfa2294e18d650',
	layoutConfiguration: (ctx) => ctx.injector.get(EstimateMainTotalLayoutService).generateLayout(),
	containerBehavior: (ctx) => ctx.injector.get(EstimateMainTotalBehavior)
});
