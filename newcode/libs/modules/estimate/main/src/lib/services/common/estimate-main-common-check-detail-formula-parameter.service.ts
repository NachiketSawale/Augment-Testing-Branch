/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs';
import { IEntity } from './estimate-main-common-features.service';

@Injectable({
	providedIn: 'root'
})

/**
 * Service providing common features for Detail Formula Parameter
 */
export class EstimateMainCommonFeaturesCheckDetailFormulaParameterService {
	/**
	 * Checks detail formula parameters based on the provided entity, value, model, data service, detail value, async marker, and service.
	 * @param {any} entity - The entity to check detail formula parameters for.
	 * @param {any} value - The value associated with the detail formula parameters.
	 * @param {string} model - The model related to the detail formula parameters.
	 * @param {any} dataService - The data service used to retrieve detail formula parameters.
	 * @param {string} detailVal - The detail value to check.
	 * @param {any} asyncMarker - An asynchronous marker.
	 * @param {any} service - A service related to the detail formula parameters.
	 * @returns {Observable<any>} An observable containing the result of the detail formula parameter check.
	 */

	public checkDetailFormulaParameter(entity: IEntity, value: unknown, model: string, dataService: unknown, detailVal: string, asyncMarker: unknown, service: unknown) {   //  need to reimplemnt : Observable<boolean >
		// const isPrjAssembly = false;
		// const isPrjPlantAssembly = false;
		//let result = {};

		// const list = detailVal.match(/(\b[a-zA-Z_]+[\w|\s*-\+\/]*)|\[.*?]/g) || [];
		// const chars = ['sin', 'tan', 'cos', 'ln'];
		// result = list.filter((li) => {
		// 	if (chars.indexOf(li.toLowerCase()) === -1) {
		// 		const match = li.match(/^[0-9]*$/g);
		// 		if (!match) {
		// 			return li;
		// 		}
		// 	}
		// });

		// if (result.length === 0) {
		// 	entity[model] = value;
		// }

		// if (entity) {
		// 	//entity[this.detailFields[model]] = math.evaluate(detailVal.replace(/\*\*/g, '^'));
		// } else {
		// 	return new Observable((observer) => {
		// 		observer.next({ valid: false });
		// 		observer.complete();
		// 		// this.platformValidationService.finishAsyncValidation({ valid: false }, entity, value, model, asyncMarker, service, dataService);
		// 	});
		// }

		// return new Observable((observer) => {
		// 	observer.next({ valid: true });
		// 	observer.complete();
		// 	// this.platformValidationService.finishAsyncValidation({ valid: true }, entity, value, model, asyncMarker, service, dataService);
		// });

		// } else {
		//   let mainService = this.$injector.get('estimateMainService');
		//   if (dataService === 'projectAssemblyResourceService' || dataService === 'projectAssemblyMainService') {
		//     mainService = this.$injector.get('projectAssemblyMainService');
		//     isPrjAssembly = true;
		//     isPrjPlantAssembly = false;
		//   }

		//   if (dataService === 'projectPlantAssemblyResourceService' || dataService === 'projectPlantAssemblyMainService') {
		//     mainService = this.$injector.get('projectPlantAssemblyMainService');
		//     isPrjPlantAssembly = true;
		//     isPrjAssembly = false;
		//   }

		//   let modificationTrackingExtension = this.$injector.get('platformDataServiceModificationTrackingExtension');
		//   let containerData = isPrjAssembly || isPrjPlantAssembly ? this.$injector.get('projectMainService').getContainerData() : mainService.getContainerData();
		//   let updateData = modificationTrackingExtension.getModifications(isPrjAssembly || isPrjPlantAssembly ? this.$injector.get('projectMainService') : mainService);
		//   updateData.EstLeadingStuctureContext = updateData.EstLeadingStuctureContext || {};
		//   updateData.EstLeadingStuctureContext = this.estimateParamUpdateService.getLeadingStructureContext(updateData.EstLeadingStuctureContext, mainService.getSelected(), mainService.getServiceName());

		//   let estimateMainResourceType = inject(estimateMainResourceType);
		//   updateData.DetailFormulaField = model;
		//   updateData.DetailFormula = entity.EstResourceTypeFk === estimateMainResourceType.ComputationalLine ? detailVal.toUpperCase() : value.toUpperCase();
		//   updateData.MainItemName = containerData.itemName;

		//   updateData.ProjectId = null;
		//   if (dataService === 'estimateAssembliesResourceService' || dataService === 'estimateAssembliesService') {
		//     updateData.ProjectId = null;
		//   } else if (dataService === 'projectAssemblyResourceService' || dataService === 'projectAssemblyMainService' || dataService === 'projectPlantAssemblyResourceService' || dataService === 'projectPlantAssemblyMainService') {
		//     updateData.MainItemName = 'EstLineItems';
		//     updateData.ProjectId = this.$injector.get('projectMainService').getSelected().Id;
		//     updateData.EstLeadingStuctureContext.Id = updateData.EstLeadingStuctureContext.EstLeadingStructureId;
		//     updateData.EstHeaderId = updateData.EstLeadingStuctureContext.EstHeaderFk;
		//   } else {
		//     updateData.ProjectId = mainService.getSelectedProjectId();
		//   }

		//updateData.IsFromDetailFormula = true;

		// return this.http.post(global.webApiBaseUrl + 'estimate/main/calculator/getdetailsparameters', updateData).pipe(
		//   tap(response => {
		//     let result = response.data;
		//     if (result && entity) {
		//       entity[this.detailFields[result.DetailFormulaField]] = result.DetailFormulaResult ? result.DetailFormulaResult : 1;
		//       // result.DetailFormula = entity.EstResourceTypeFk === estimateMainResourceType.ComputationalLine ? originalDetailValue : result.DetailFormula;
		//     }
		//     if (result.FormulaParameterEntities && result.FormulaParameterEntities.length) {
		//       result.entity = entity;
		//       result.dataServName = dataService;
		//       result.containerData = containerData;
		//       result.isFormula = true;
		//       result.options = options;
		//       result.field = model;
		//       if (options.isBulkEdit) {
		//         result.isBulkEdit = true;
		//         result.options = { itemServiceName: dataService };
		//         result.EstLineItems = mainService.getSelectedEntities();
		//         result.EstLeadingStuctEntities = mainService ? mainService.getSelectedEntities() : null;
		//       }

		//       if (isPrjAssembly) {
		//         result.FormulaParameterEntities.forEach(item => {
		//           item.IsPrjAssembly = true;
		//         });
		//       }

		//       if (isPrjPlantAssembly) {
		//         result.FormulaParameterEntities.forEach(item => {
		//           item.IsPrjPlantAssembly = true;
		//         });
		//       }

		//       let estimateMainDetailsParamDialogService = this.$injector.get('estimateMainDetailsParamDialogService');
		//       if (mainService.getServiceName() === 'estimateAssembliesService') {
		//         estimateMainDetailsParamDialogService = this.$injector.get('estimateAssembliesDetailsParamDialogService');
		//       }

		//       return estimateMainDetailsParamDialogService.showDialog(result, mainService.getDetailsParamReminder()).then(
		//         () => {
		//           this.platformValidationService.finishAsyncValidation({ valid: true }, entity, value, model, asyncMarker, service, dataService);
		//         },
		//         () => true
		//       );
		//     } else {
		//       this.calculateOnchange();
		//       this.platformValidationService.finishAsyncValidation({ valid: true }, entity, value, model, asyncMarker, service, dataService);
		//     }
		//   })
		// );
	}
}
