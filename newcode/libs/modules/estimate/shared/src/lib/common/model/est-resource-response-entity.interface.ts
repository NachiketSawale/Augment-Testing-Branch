import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { ICostCodeEntity } from '@libs/basics/interfaces';
import { IMaterialSearchEntity } from '@libs/basics/shared';

/**
 * use for get resource tree
 */
export interface IEstResourceResponseEntity{
	/**
	 * dtos
	 */
	dtos : IEstResourceEntity[];

	/**
	 * LineItem
	 */
	LineItem : IEstLineItemEntity | null;

	/**
	 * dynamicColumns
	 */
	dynamicColumns : object;

	/**
	 * LookupAssemblies
	 */
	LookupAssemblies? : IEstLineItemEntity[] | null;

	/**
	 * LookupCostCodes
	 */
	LookupCostCodes?: ICostCodeEntity[] | null;

	/**
	 * LookupMaterials
	 */
	LookupMaterials?: IMaterialSearchEntity[] | null;

	/**
	 * parentJobFk
	 */
	parentJobFk?: number | null;

	/**
	 * EnableEstResourceCostUnitAdvanceEditing
	 */
	EnableEstResourceCostUnitAdvanceEditing?: boolean | null;

	/**
	 * AllowDefaultExpansionOfEstimateResources
	 */
	AllowDefaultExpansionOfEstimateResources?: boolean | null;
}