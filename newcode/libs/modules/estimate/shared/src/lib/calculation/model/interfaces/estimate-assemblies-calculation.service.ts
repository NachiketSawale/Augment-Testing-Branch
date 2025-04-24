import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { IEstResourceEntity } from '@libs/estimate/interfaces';

/**
 * interface for assembly calculation
 */
export interface IEstimateAssembliesCalculationService{
	/**
	 * calculate the quantity and cost total of lineItem and resources
	 * @param lineItem
	 * @param resources
	 */
	calculateLineItemAndResourcesOfAssembly(lineItem: IEstLineItemEntity, resources : IEstResourceEntity[]): void;

	/**
	 * calculate current resource and its parent and children, then return the modified resources
	 * @param resource
	 * @param lineItem
	 * @param resources
	 */
	calculateResourceOfAssembly(resource: IEstResourceEntity, lineItem: IEstLineItemEntity, resources : IEstResourceEntity[]):IEstResourceEntity[];

	/**
	 * calculate current resource and its parent and children, then return the modified resources
	 * @param resource
	 * @param lineItem
	 * @param resources
	 */
	updateResourceOfAssembly(resource: IEstResourceEntity, lineItem: IEstLineItemEntity, resources : IEstResourceEntity[]):IEstResourceEntity[];

	/**
	 * calculate quantity relate properties of lineItem
	 * @param lineItem
	 */
	calculateQuantityOfLineItem(lineItem: IEstLineItemEntity):void;
}