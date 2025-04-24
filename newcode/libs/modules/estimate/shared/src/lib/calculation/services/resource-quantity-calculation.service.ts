/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstLineItemEntity, IEstResourceEntity } from '@libs/estimate/interfaces';
import { getChildrenFunc } from '../model/interfaces/resource-children-function.interface';
import { inject, Injectable } from '@angular/core';
import { EstimateMainRoundingService } from '../../common/services/rounding/estimate-main-rounding.service';
import { EstimateMainContextService } from '../../common/services/estimate-main-context.service';
import { EstimateMainResourceTypeService } from '../../common/services/estimate-main-resource-type.service';

/**
 * Resource Quantity Calculation Service
 */
@Injectable({
	providedIn: 'root',
})
export class ResourceQuantityCalculationService {
	private readonly estimateMainRoundingService = inject(EstimateMainRoundingService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly estimateMainResourceTypeService = inject(EstimateMainResourceTypeService);

	/**
	 * calculate quantity relate property of resource
	 * @param resource
	 * @param lineItem
	 * @param parentResource
	 */
	public calculateQuantityOfResource(resource: IEstResourceEntity, lineItem: IEstLineItemEntity, parentResource:IEstResourceEntity|null){
		this.estimateMainRoundingService.roundInitialQuantities(resource);
		if(resource.IsLumpsum){
			this.calculateQuantityOfLumpsumResource(resource, lineItem, parentResource);
		}else{
			this.calculateQuantityOfNormalResource(resource, lineItem, parentResource);
		}
	}

	/**
	 * calculate quantityTotal of resources
	 * @param lineItem
	 * @param resources
	 * @param getChildren
	 */
	public calculateQuantityTotalOfResources(lineItem: IEstLineItemEntity, resources: IEstResourceEntity[], getChildren: getChildrenFunc) {
		if (lineItem === null) {
			return;
		}
		if (resources !== null) {
			const resourcesOfFirstLevel = resources.filter(item => item.EstResourceFk === null);
			this.calculateQuantityTotalOfResourcesInternal(lineItem, resourcesOfFirstLevel, null, getChildren);
		}
	}

	private calculateQuantityReal(resource: IEstResourceEntity){
		/* if resource is subItem, set quantityFactorCc = 1 */
		resource.QuantityFactorCc = resource && (this.estimateMainResourceTypeService.isSubItemOrCompositeAssembly(resource) || this.estimateMainResourceTypeService.isEquipmentAssembly(resource)) ? 1 : resource.QuantityFactorCc;

		/** QuantityReal:Resources:QuantityReal = Quantity x QuantityFactor(1,2,3,4) x ProduktivityFactor / EfficiencyFactor(1, 2) x QuantityFactorCC
		 *SubItems:QuantityReal = Quantity x QuantityFactor(1,2,3,4) x ProduktivityFactor / EfficiencyFactor(1, 2)
		 */
		resource.QuantityReal = (resource.Quantity * resource.QuantityFactor1 * resource.QuantityFactor2 * resource.QuantityFactor3 * resource.QuantityFactor4 * resource.ProductivityFactor * resource.QuantityFactorCc)/(resource.EfficiencyFactor1 * resource.EfficiencyFactor2);

		/* if resource is Disabled, quantityReal equal 0 */
		resource.QuantityReal = !resource.IsDisabled && !resource.IsDisabledPrc ? resource.QuantityReal : 0;

		return resource.QuantityReal;
	}

	private calculateQuantityOfLumpsumResource(resource: IEstResourceEntity, lineItem: IEstLineItemEntity, parentResource: IEstResourceEntity| null){

		/* calculate quantityReal */
		this.calculateQuantityReal(resource);

		/* if resource is lumpsum, quantityTotal equal quantityReal */
		resource.QuantityTotal = resource.QuantityReal;

		if ((lineItem.IsOptional && !lineItem.IsOptionalIT) || lineItem.IsDisabled) {
			const lineItemQtyTarget = this.estimateMainContextService.IsCalcTotalWithWQ ? lineItem.WqQuantityTarget : lineItem.QuantityTarget;

			resource.QuantityUnitTarget = resource.QuantityTotal /  (lineItem.IsLumpsum ?  1 : lineItemQtyTarget);

			const quantityUnitTarget = lineItem.Quantity * lineItem.QuantityFactor1 * lineItem.QuantityFactor2 * lineItem.QuantityFactor3 * lineItem.QuantityFactor4 * lineItem.ProductivityFactor;

			resource.QuantityInternal = quantityUnitTarget !== 0 ? resource.QuantityUnitTarget / quantityUnitTarget : 0;

			if (parentResource !== null) {
				resource.QuantityReal = parentResource.QuantityInternal !== 0 ? resource.QuantityInternal / parentResource.QuantityInternal : 0;
			}else {
				resource.QuantityReal = resource.QuantityInternal;
			}

			resource.QuantityUnitTarget = 0;
			resource.QuantityTotal = 0;
		}else if(resource.QuantityTotal === 0 || lineItem.QuantityTotal === 0){

			resource.QuantityInternal = 0;

			resource.QuantityUnitTarget = 0;

			resource.QuantityReal = 0;
		}else {
			const lineItemQtyTarget = this.estimateMainContextService.IsCalcTotalWithWQ ? lineItem.WqQuantityTarget : lineItem.QuantityTarget;

			resource.QuantityUnitTarget = resource.QuantityTotal / (lineItem.IsLumpsum ? 1 : lineItemQtyTarget);

			resource.QuantityInternal = resource.QuantityUnitTarget / lineItem.QuantityUnitTarget;

			if (parentResource) {
				resource.QuantityReal = resource.QuantityInternal / parentResource.QuantityInternal;
			} else {
				resource.QuantityReal = resource.QuantityInternal;
			}
		}
	}

	private calculateQuantityOfNormalResource(resource: IEstResourceEntity, lineItem: IEstLineItemEntity, parentResource: IEstResourceEntity|null){

		/* calculate quantityReal */
		this.calculateQuantityReal(resource);

		if(parentResource){

			/* Next levels:QuantityInternal = QuantityReal * QuantityInternal(Level-1) */
			resource.QuantityInternal = resource.QuantityReal * parentResource.QuantityInternal;
		}else{

			/* First Level:QuantityInternal =  QuantityReal */
			resource.QuantityInternal = resource.QuantityReal;
		}

		/* QuantityUnitTarget  = QuantityUnitTarget (of parent Line Item) x QuantityInternal */
		resource.QuantityUnitTarget = lineItem.QuantityUnitTarget * resource.QuantityInternal;

		/* QuantityTotal = QuantityTotal (of parent Line Item) x QuantityInternal */
		resource.QuantityTotal = (lineItem.IsOptional && !lineItem.IsOptionalIT) ? 0 : lineItem.QuantityTotal * resource.QuantityInternal;
		resource.QuantityTotal = this.estimateMainRoundingService.doRoundingValue('QuantityTotal',resource.QuantityTotal);
	}

	private calculateQuantityTotalOfResourcesInternal(lineItem: IEstLineItemEntity, resources:IEstResourceEntity[], parent: IEstResourceEntity|null,getChildren: getChildrenFunc) {
		if (lineItem === null) {
			return;
		}

		if (resources !== null) {
			resources.forEach(res => {
				this.calculateQuantityOfResource(res,lineItem, parent);

				/* subItem */
				if (this.estimateMainResourceTypeService.isSubItemOrCompositeAssembly(res) || this.estimateMainResourceTypeService.isEquipmentAssembly(res)) {
					const children = getChildren(res);

					if (children !== null) {
						this.calculateQuantityTotalOfResourcesInternal(lineItem, children, res, getChildren);
					}
				}
			});
		}
	}
}