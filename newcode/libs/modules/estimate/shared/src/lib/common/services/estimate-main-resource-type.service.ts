/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { EstimateMainContextService } from './estimate-main-context.service';
import { inject, Injectable } from '@angular/core';
import { EstimateMainResourceType } from '../enums/estimate-main-resource-type.enum';
import { IEstAssemblyTypeEntity } from '@libs/estimate/interfaces';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { AssemblyType } from '../enums/assembly-type.enum';

/**
 * use to judge the resource type
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateMainResourceTypeService{
	private estimateMainContextService = inject(EstimateMainContextService);

	public isMaterial(resource: IEstResourceEntity){
		return resource.EstResourceTypeFk === EstimateMainResourceType.Material;
	}

	public isSubItem(resource: IEstResourceEntity){
		return resource.EstResourceTypeFk === EstimateMainResourceType.SubItem;
	}

	public isSubItemEx(res: IEstResourceEntity) {
		return (res.EstResourceTypeFk === EstimateMainResourceType.SubItem || res.EstResourceTypeFkExtend === EstimateMainResourceType.SubItem) && res.EstAssemblyFk === null;
	}

	public isAssembly(resource: IEstResourceEntity) {
		return resource.EstResourceTypeFk === EstimateMainResourceType.Assembly;
	}

	public isEquipmentAssembly(resource: IEstResourceEntity) {
		return resource.EstResourceTypeFk === EstimateMainResourceType.Plant;
	}

	public isCompositeAssembly(resource: IEstResourceEntity) {
		return resource.EstResourceTypeFk === EstimateMainResourceType.Assembly && resource.EstAssemblyTypeFk && resource.EstAssemblyTypeFk > 0;
	}

	public isNormalAssembly(resource: IEstResourceEntity){
		return resource.EstResourceTypeFk === EstimateMainResourceType.Assembly && !resource.EstAssemblyTypeFk;
	}

	public isSubItemOrCompositeAssembly(resource: IEstResourceEntity) {
		return this.isSubItem(resource) || this.isCompositeAssembly(resource);
	}

	public isAdvancedAllowanceCostCode(resource: IEstResourceEntity) {
		const advancedAllowanceCostCodeFk = this.estimateMainContextService.AdvancedAllowanceCc;

		if (!advancedAllowanceCostCodeFk) {
			return false;
		}

		return (resource.EstResourceTypeFk === EstimateMainResourceType.Assembly || resource.EstResourceTypeFk === EstimateMainResourceType.CostCode) && resource.MdcCostCodeFk === advancedAllowanceCostCodeFk;
	}

	public isCrewAssembly(assemblyType: IEstAssemblyTypeEntity | null, assemblyEntity: IEstLineItemEntity){
		return !!(assemblyType && assemblyType.EstAssemblyTypeLogicFk === AssemblyType.CrewAssembly && assemblyEntity.MdcCostCodeFk);
	}

	public isMaterialAssembly(assemblyType: IEstAssemblyTypeEntity | null, assemblyEntity: IEstLineItemEntity){
		return !!(assemblyType && assemblyType.EstAssemblyTypeLogicFk === AssemblyType.MaterialAssembly && assemblyEntity.MdcMaterialFk);
	}

	public isMaterialAssemblyUpdated(assemblyType: IEstAssemblyTypeEntity | null, assemblyEntity: IEstLineItemEntity){
		return !!(assemblyType && assemblyType.EstAssemblyTypeLogicFk === AssemblyType.MaterialAssemblyUpdated && assemblyEntity.MdcMaterialFk);
	}

	public isCrewAssemblyUpdated(assemblyType: IEstAssemblyTypeEntity | null, assemblyEntity: IEstLineItemEntity){
		return !!(assemblyType && assemblyType.EstAssemblyTypeLogicFk === AssemblyType.CrewAssemblyUpdated && assemblyEntity.MdcCostCodeFk);
	}

	public isCAorMAorCUorMUAssembly(assemblyType: IEstAssemblyTypeEntity | null, assemblyEntity: IEstLineItemEntity){
		return this.isCrewAssembly(assemblyType, assemblyEntity) || this.isMaterialAssembly(assemblyType, assemblyEntity) || this.isMaterialAssemblyUpdated(assemblyType, assemblyEntity) || this.isCrewAssemblyUpdated(assemblyType, assemblyEntity);
	}
}