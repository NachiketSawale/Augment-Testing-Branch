/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntity } from './estimate-main-common-features.service';

@Injectable({
	providedIn: 'root'
})

/**
 * Service providing features for CalculateOnChange
 */
export class EstimateMainCommonFeaturesCalculateOnChangeService {
	/**
	 * Executes a calculation on change event.
	 * @param {string} dataServName - The name of the data service.
	 * @param {any} options - Additional options for the calculation.
	 * @param {IEntity} entity - The entity related to the calculation.
	 * @param {any} model - The model associated with the calculation.
	 * @param {any} value - The value triggering the calculation.
	 * @returns {void} This method does not return anything.
	 */
	public calculateOnchange(dataServName: string, options: unknown, entity: IEntity, model: unknown, value: unknown): void {
		//let serv: any = null;

		// todo (depends on injected services)
		switch (dataServName) {
			case 'estimateMainService':
				//serv = inject(EstimateMainLineItemDetailService);
				break;
			case 'estimateMainResourceService':
				//serv = inject(EstimateMainResourceDetailService);
				break;
			case 'estimateMainLineItem2MdlObjectService':
				//serv = inject(EstimateMainLineitem2MdlObjectDetailService);
				break;
			case 'estimateAssembliesResourceService':
				//serv = inject(estimateAssembliesResourceService);
				break;
			case 'estimateAssembliesService':
				//serv = inject(estimateAssembliesService);
				break;
			case 'projectAssemblyMainService':
				//serv = inject(projectAssemblyMainService);
				break;
			case 'projectPlantAssemblyMainService':
				//serv = inject(projectPlantAssemblyMainService);
				break;
			case 'projectAssemblyResourceService':
				//serv = inject(projectAssemblyResourceService);
				break;
			case 'projectPlantAssemblyResourceService':
				//serv = inject(projectPlantAssemblyResourceService);
				break;
			case 'resourceEquipmentPlantGroupEstimationLineItemDataService':
				//serv = inject(resourceEquipmentPlantGroupEstimationLineItemDataService);
				break;
			case 'resourceEquipmentGroupPlantEstimationResourceDataService':
				//serv = inject(resourceEquipmentGroupPlantEstimationResourceDataService);
				break;
			case 'resourceEquipmentPlantEstimationLineItemDataService':
				//serv = inject(resourceEquipmentPlantEstimationLineItemDataService);
				break;
			case 'resourceEquipmentPlantEstimationResourceDataService':
				//serv = inject(resourceEquipmentPlantEstimationResourceDataService);
				break;
			case 'resourcePlantEstimateLineItemDataService':
				//serv = inject(resourcePlantEstimateLineItemDataService);
				break;
			case 'resourcePlantEstimateResourceDataService':
				//serv = inject(resourcePlantEstimateResourceDataService);
				break;
			default:
				break;
		}

		// if (serv) {
		// 	if (options.isBulkEdit && typeof serv.valueChangeCalculationForBulkEdit === 'function') {
		// 		serv.valueChangeCalculationForBulkEdit(entity, model, value);
		// 	} else {
		// 		serv.valueChangeCallBack(entity, model);
		// 	}
		// }
	}
}
