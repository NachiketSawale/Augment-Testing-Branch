import { CompleteIdentification } from '@libs/platform/common';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { ResourceBaseComplete } from './estmate-resource-base-complete.class';
import { EstimateMainPrcItemAssignmentComplete } from '../../model/estimate-main-prc-item-assignment-complete.class';
import { IEstimateMainPrcItemAssignmentEntity } from '../../model/estimate-main-prc-item-assignment-entitiy.interface';
import { IEstResourceEntity } from '@libs/estimate/interfaces';

/**
 * Line Item Base Complete
 */
export class LineItemBaseComplete extends CompleteIdentification<IEstLineItemEntity>{
	/**
	 * Main item ID.
	 */
	public MainItemId?: number;

	/**
	 * Entities count modified.
	 */
	public EntitiesCount?: number;

	/**
	 * Estimate Header ID.
	 */
	public EstHeaderId?: number;

	/**
	 * skips budget calculation for reference line item
	 */
	public SkipCalculationForRefLineItem?: boolean;

	/**
	 * Reference to a LineItemBaseEntity.
	 */
	public EstLineItems?: IEstLineItemEntity[];

	/**
	 * Reference to a ResourceBaseComplete array.
	 */
	public EstResourceToSave?: ResourceBaseComplete[];

	public EstResourceToDelete?: IEstResourceEntity[];


	public EstimateMainPrcItemAssignmentsToSave?:EstimateMainPrcItemAssignmentComplete[] | null;


	public EstimateMainPrcItemAssignmentsToDelete?:IEstimateMainPrcItemAssignmentEntity[]| null;

	public ShowedLineItemIds?: number[] | null;

	public CostGroupToDelete?: object[] | null;

	public CostGroupToSave?: object[] | null;

}