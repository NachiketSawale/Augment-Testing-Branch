import { IFilterResult } from '@libs/platform/common';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { IBasicsCustomizeLineItemContextEntity } from '@libs/basics/interfaces';
import { IEstRoundingConfigComplete } from './est-rounding-config-complete.interface';

/**
 * IEstAssemblyResponseEntity
 */
export interface IEstAssemblyResponseEntity {
	/**
	 * FilterResult
	 */
	FilterResult: IFilterResult;

	/**
	 * dtos
	 */
	dtos: IEstLineItemEntity[] | null;

	/**
	 * Assembly2CostGroups
	 */
	Assembly2CostGroups: object[] | null;

	/**
	 * CostGroupCats
	 */
	CostGroupCats: object[] | null;

	/**
	 * highlightJobIds
	 */
	highlightJobIds: Array<number | null>;

	/**
	 * lineItemContext
	 */
	lineItemContext: IBasicsCustomizeLineItemContextEntity | null;

	/**
	 * CompanyCurrency
	 */
	CompanyCurrency: number;

	/**
	 * DoConsiderDisabledDirect
	 */
	DoConsiderDisabledDirect: boolean | null;

	/**
	 * AssemblyRoundingConfigDetails
	 */
	AssemblyRoundingConfigDetails: IEstRoundingConfigComplete | null;
}