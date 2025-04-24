/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

/**
 * Cost code entity
 */
export class ICostCodeEntity implements IEntityBase {
	/**
	 * Description info
	 */
	public DescriptionInfo?: IDescriptionInfo | null;

	/**
	 * Is live
	 */
	public IsLive?: boolean | null;

	/**
	 * Is labour
	 */
	public IsLabour?: boolean;

	/**
	 * IsProjectChildAllowed
	 */
	public IsProjectChildAllowed?: boolean | null;

	/**
	 * Procurement structure Type
	 */
	public UomFk?: number;

	/**
	 * Cost Code Parent Id
	 */
	public CostCodeParentFk?: number | null;

	/**
	 * Children Cost Codes
	 */
	public CostCodes?: ICostCodeEntity[] | null;

	/**
	 * Rate
	 */
	public Rate?: number | null;

	/**
	 * Currency
	 */
	public CurrencyFk?: number | null;

	/**
	 * Factor Cost
	 */
	public FactorCosts?: number | null;

	/**
	 * Real Factor Cost
	 */
	public RealFactorCosts?: number | null;

	/**
	 * Factor Quantity
	 */
	public FactorQuantity?: number | null;

	/**
	 * Real Factor Quantity
	 */
	public RealFactorQuantity?: number | null;

	/**
	 * Cost Code Type
	 */
	public CostCodeTypeFk?: number | null;

	/**
	 * Day Work Rate
	 */
	public DayWorkRate?: number;

	/**
	 * Day Work Rate
	 */
	public RawDayWorkRate?: number;

	/**
	 * Day Work Rate
	 */
	public CostCodePriceListFk?: number | null;

	/**
	 * Remark
	 */
	public Remark?: string | null;

	/**
	 * Date stating the last update of the entity
	 */
	public readonly UpdatedAt?: Date;

	/**
	 *  User id of the last entity update
	 */
	public readonly UpdatedBy?: number;

	/**
	 * Current version of the entity
	 */
	public readonly Version?: number;

	/**
	 * IsOnlyProjectCostCode of the entity
	 */
	public readonly IsOnlyProjectCostCode?: boolean;

	/**
	 * OriginalId of the entity
	 */
	public readonly OriginalId?: number | null;

	/**
	 * EstCostTypeFk of the entity
	 */
	public readonly EstCostTypeFk?: number | null;

	/**
	 * FactorHour of the entity
	 */
	public readonly FactorHour?: number;

	/**
	 * HourUnit of the entity
	 */
	public readonly HourUnit?: number;

	/**
	 * PrcStructureFk of the entity
	 */
	public readonly PrcStructureFk?: number;

	/**
	 * IsRate of the entity
	 */
	public readonly IsRate?: boolean;

	/**
	 * IsEditable of the entity
	 */
	public readonly IsEditable?: boolean;

	/**
	 * IsBudget of the entity
	 */
	public readonly IsBudget?: boolean;

	/**
	 * IsCost of the entity
	 */
	public readonly IsCost?: boolean;

	/**
	 * IsEstimateCostCode of the entity
	 */
	public readonly IsEstimateCostCode?: boolean;

	/**
	 * IsRuleMarkupCostCode of the entity
	 */
	public readonly IsRuleMarkupCostCode?: boolean;

	/**
	 * Co2Source of the entity
	 */
	public readonly Co2Source?: number | null;

	/**
	 * Co2Project of the entity
	 */
	public readonly Co2Project?: number | null;

	/**
	 * The constructor
	 * @param Id
	 * @param Code
	 */
	public constructor(
		public Id: number,
		public Code: string,
	) {}
}
