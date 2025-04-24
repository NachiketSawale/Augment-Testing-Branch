import { ILayoutConfiguration } from '@libs/ui/common';
import { ICashProjectionDetailEntity } from '../models/entities/cash-projection-detail-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';

export class BasicsSharedCashFlowLayoutService {
	public static generateLayout(): ILayoutConfiguration<ICashProjectionDetailEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					attributes:
						[
							'EndDate', 'PercentOfTime', 'PercentOfCost', 'CalcCumCost', 'CalcPeriodCost',
							'CalcCumCash', 'CalcPeriodCash', 'CumCost', 'PeriodCost', 'CumCash', 'PeriodCash',
							// defect:133574 Temporarily hide two columns actperiodcost&actperiodcash
							//'ActPeriodCost', 'ActPeriodCost'
						],
				},
				{
					gid: 'entityHistory',
					attributes: ['InsertedAt', 'InsertedBy', 'UpdatedAt', 'UpdatedBy', 'Version'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.common.', {
					PercentOfTime: { key: 'percentOfTime', text: 'Percent Of Time' },
					PercentOfCost: { key: 'percentOfCost', text: 'Percent Of Cost' },
					CalcCumCost: { key: 'calcCumCost', text: 'Calculated Cumulative Cost' },
					CalcPeriodCost: { key: 'calcPeriodCost', text: 'Calculated Period Cost' },
					CalcCumCash: { key: 'calcCumCash', text: 'Calculated Cumulative Cash' },
					CalcPeriodCash: { key: 'calcPeriodCash', text: 'Calculated Period Cash' },
					CumCost: { key: 'cumCost', text: 'Cumulative Cost' },
					PeriodCost: { key: 'periodCost', text: 'Period Cost' },
					CumCash: { key: 'cumCash', text: 'Cumulative Cash' },
					PeriodCash: { key: 'periodCash', text: 'Period Cash' },
					ActPeriodCost: { key: 'actPeriodCost', text: 'Actual Period Cost' },
					ActPeriodCash: { key: 'actPeriodCash', text: 'Actual Period Cash' },
				}),
				EndDate: { key: 'basics.company.entityEndDate', text: 'Period End Date' },
			},
			overloads: {
				EndDate: { readonly: true },
				PercentOfTime: { readonly: true },
				PercentOfCost: { readonly: true },
				CalcCumCost: { readonly: true },
				CalcPeriodCost: { readonly: true },
				CalcCumCash: { readonly: true },
				CalcPeriodCash: { readonly: true },
				ActPeriodCost: { readonly: true },
				ActPeriodCash: { readonly: true },
			},
		};
	}
}
