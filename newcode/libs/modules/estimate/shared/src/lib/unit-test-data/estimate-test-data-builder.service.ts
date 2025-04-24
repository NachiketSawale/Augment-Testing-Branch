/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstLineItemEntity, IEstResourceEntity } from '@libs/estimate/interfaces';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class EstimateTestDataBuilderService {
	//create line item
	public createLineItem(overrides = {}) {
		return {
			Id: 1,
			EstHeaderFk: 1001,
			EstResourceFk: null,
			IsDisabled: false,
			IsLumpsum: false,
			IsOptional: false,
			IsOptionalPrc: false,
			Quantity: 1,
			WqQuantityTarget: 1,
			QuantityTarget: 1,
			QuantityFactor1: 1,
			QuantityFactor2: 1,
			QuantityFactor3: 1,
			QuantityFactor4: 1,
			ProductivityFactor: 1,
			QuantityUnitTarget: 1,
			QuantityTotal: 1,
			CostUnit: 10,
			CostUnitTarget: 10,
			CostFactor1: 1,
			CostFactor2: 1,
			CostTotal: 10,
			HoursUnit: 2,
			MarkupCostUnit: 20,
			DayWorkRateTotal: 8,
			DayWorkRateUnit: 8,
			Co2Source: 5,
			Co2Project: 10,
			AdvancedAllUnit: 10,
			AdvancedAllowance: 10,
			AdvancedAllowanceCostUnit: 10,
			Allowance: 10,
			AllowanceUnit: 10,
			BudgetUnit: 10,
			Budget: 10,
			QuantityFactorCc: 1,
			EscalationCostUnit: 0,
			EntCostUnit: 1,
			DruCostUnit: 0,
			IndCostUnit: 0,
			EntHoursUnit: 1,
			DruHoursUnit: 0,
			IndHoursUnit: 0,
			...overrides,
		} as unknown as IEstLineItemEntity;
	}

	//create resource
	public createResource(overrides = {}) {
		return {
			Id: 1,
			EstHeaderFk: 1001,
			EstLineItemFk: 1,
			EstResourceFk: null,
			IsDisabled: false,
			IsDisabledPrc: false,
			IsInformation: false,
			IsCost: true,
			QuantityReal: 1,
			Quantity: 1,
			QuantityInternal: 1,
			QuantityTotal: 1,
			QuantityFactor1: 1,
			QuantityFactor2: 1,
			QuantityFactor3: 1,
			QuantityFactor4: 1,
			QuantityFactorCc: 1,
			ProductivityFactor: 1,
			EfficiencyFactor1: 1,
			EfficiencyFactor2: 1,
			CostUnit: 1,
			HoursUnit: 2,
			MarkupCostUnit: 1,
			DayWorkRateUnit: 1,
			Co2Source: 1,
			Co2Project: 0,
			CostFactor1: 1,
			CostFactor2: 1,
			CostFactorCc: 1,
			ExchangeRate: 1,
			HourFactor: 1,
			EstAssemblyFk: null,
			AdvancedAllUnit: 1,
			AdvancedAllowance: 1,
			AdvancedAllowanceCostUnit: 1,
			Allowance: 1,
			...overrides,
		} as unknown as IEstResourceEntity;
	}
}