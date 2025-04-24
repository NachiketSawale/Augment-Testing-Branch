/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EstimateMainCommonFeaturesFieldChangedService } from './estimate-main-common-field-changed.service';
import { EstimateMainCommonFeaturesCheckDetailFormulaParameterService } from './estimate-main-common-check-detail-formula-parameter.service';
import { EstimateMainCommonFeaturesCalculateOnChangeService } from './estimate-main-common-calculate-onchange.service';
import { PlatformTranslateService } from '@libs/platform/common';


export interface IEntity {
	ValueType: ValueType;
	IsLookup: boolean;
	ParameterValue: number | boolean;
	EstRuleParamValueFk: number;
	DefaultValue: number | boolean;
	Code: string;
	ParameterText?: string;
	ValueText?: string;
}

export enum ValueType {
	Decimal2,
	TextFormula,
}

@Injectable({
	providedIn: 'root'
})

/**
 * Service providing common features for estimating main
 */
export class EstimateMainCommonFeaturesService {
	private constructor(
		private http: HttpClient,
		//private platformRuntimeDataService: PlatformRuntimeDataService,
		//private estimateParamUpdateService: EstimateParamUpdateService,
		//protected httpMap = new Map<string, Observable<unknown>>(),
		private translationService: PlatformTranslateService,
		private estimateMainCommonFeaturesFieldChangedService: EstimateMainCommonFeaturesFieldChangedService,
		private estimateMainCommonFeaturesCheckDetailFormulaParameterService: EstimateMainCommonFeaturesCheckDetailFormulaParameterService,
		private estimateMainCommonFeaturesCalculateOnChangeService: EstimateMainCommonFeaturesCalculateOnChangeService,
	) {}

	private detailFields: { [key: string]: string } = {
		QuantityDetail: 'Quantity',
		QuantityFactorDetail1: 'QuantityFactor1',
		QuantityFactorDetail2: 'QuantityFactor2',
		QuantityTargetDetail: 'QuantityTarget',
		WqQuantityTargetDetail: 'WqQuantityTarget',
		ProductivityFactorDetail: 'ProductivityFactor',
		CostFactorDetail1: 'CostFactor1',
		CostFactorDetail2: 'CostFactor2',
		EfficiencyFactorDetail1: 'EfficiencyFactor1',
		EfficiencyFactorDetail2: 'EfficiencyFactor2'
	};

	private hasCalculatedColumn: string = '';

	/**
	 * Get the value of the hasCalculatedColumn variable.
	 * @returns {string} The value of the hasCalculatedColumn variable.
	 */
	public getHasCalculatedColumn(): string {
		return this.hasCalculatedColumn;
	}

	/**
	 * Clear the hasCalculatedColumn variable.
	 */
	public clearHasCalculatedColumn(): void {
		this.hasCalculatedColumn = '';
	}

	/**
	 * Retrieves details formula parameters based on the provided entity, value, model, data service, and options.
	 * @param {IEntity} entity - The entity for which details formula parameters are being retrieved.
	 * @param {any} value - The value associated with the details formula parameters.
	 * @param {string} model - The model related to the details formula parameters.
	 * @param {any} dataService - The data service used to retrieve details formula parameters.
	 * @param {any} options - Additional options for retrieving details formula parameters.
	 * @returns {any} The details formula parameters retrieved based on the provided inputs.
	 */
	public getDetailsFormulaParameters(entity: IEntity, value: unknown, model: string, dataService: unknown, options: unknown) {
		//const originalDetailValue = value.toString();
		//let detailVal = value.toString();

		// detailVal = detailVal
		// 	.replace(/[,]/gi, '.')
		// 	.replace(/\s/gi, '')
		// 	.replace(/\'.*?\'/gi, '')
		// 	.replace(/{.*?}/gi, '');

		// let checkDetailVal = detailVal
		// 	.replace(/mod/gi, '%')
		// 	.replace(/\'.*?\'/gi, '')
		// 	.replace(/{.*?}/gi, '');

		// if (new RegExp('[^a-zA-Z\\d.]|e|pi|div', 'ig').test(checkDetailVal)) {
		// 	const checkFormulaUrl = global.webApiBaseUrl + 'estimate/main/calculator/checkformular?exp=' + encodeURIComponent(detailVal);

			// todo ( depends on platformValidationService.finishAsyncValidation,estimateMainService)
			// asyncMarker.myPromise = this.http.get(checkFormulaUrl);
			// return asyncMarker.myPromise.pipe(
			//   tap((response: any) => {
			//     if (response && response.data && !response.data.valid) {
			//       if (response.data.formulaError) {
			//         const errStr = response.data.formulaError.join(', ');
			//         this.platformValidationService.finishAsyncValidation({ valid: false, error: errStr }, entity, value, model, asyncMarker, this.estimateMainService, dataService);
			//       }
			//     } else {
			//       const formulaResult = response && response.data && response.data.hasCalculateResult ? response.data.expResult : null;
			//       if (formulaResult || formulaResult === 0) {
			//         entity[model] = value;
			//         entity[model] = formulaResult;
			//         this.hasCalculatedColumn = model;
			//         this.calculateOnchange();
			//         this.platformValidationService.finishAsyncValidation({ valid: true }, entity, value, model, asyncMarker, this.estimateMainService, dataService);
			//       } else {
			//         this.checkDetailFormulaParameter();
			//       }
			//     }
			//   })
		// 	// );
		// } else {
		// 	//return this.checkDetailFormulaParameter();
		// }
	}

	/**
	 * Generates an asynchronous detail validation function based on the provided field and data service.
	 * @param {any} field - The field for which the validation function is generated.
	 * @param {any} dataService - The data service used for validation.
	 * @returns {(entity: IEntity, value: any, model: any, options: any, isFromBulkEditor?: boolean) => Observable<any>} An asynchronous validation function.
	 */
	// public generateAsyncDetailValidation(field: any, dataService: any): (entity: IEntity, value: any, model: any, options: any, isFromBulkEditor?: boolean) => Observable<any> {
	//   return (entity: IEntity, value: any, model: any, options: any, isFromBulkEditor?: boolean): Observable<any> => {
	//     if (!options) {
	//       options = {};
	//     }
	//     options.itemName = 'EstLineItems';
	//     options.itemServiceName = 'estimateMainService';
	//     options.validItemName = 'EstLineItems';
	//     if (isFromBulkEditor) {
	//       options.isBulkEdit = isFromBulkEditor;
	//     }
	//     // Assuming `this.getDetailsFormulaParameters` returns an Observable
	//    // return this.getDetailsFormulaParameters(entity, value, field, dataService, options);
	//   };
	// }

	/**
	 * Retrieves asynchronous detail validation functions based on the provided data service.
	 * @param {any} dataService - The data service used for validation.
	 * @returns {{ [key: string]: (entity: IEntity, value: any, model: any, options: any, isFromBulkEditor?: boolean) => Observable<unknown> }} An object containing asynchronous validation functions indexed by keys.
	 */
	// public getAsyncDetailValidation(dataService: unknown): { [key: string]: (entity: IEntity, value: unknown, model: unknown, options: unknown, isFromBulkEditor?: boolean) => Observable<any> } {
	// 	const result: { [key: string]: (entity: IEntity, value: unknown, model: unknown, options: unknown, isFromBulkEditor?: boolean) => Observable<unknown> } = {};
	// 	// Iterate over detailFields and generate async validation functions for each field
	// 	for (const [key, val] of Object.entries(this.detailFields)) {
	// 		//result['asyncValidate' + key] = this.generateAsyncDetailValidation(key, dataService); //todo
	// 	}
	// 	return result;
	// }
	// private valueTypes = inject(estimateRuleParameterConstant);

	/**
	 * Updates the code of a current item and its related items in the cache.
	 * @param {any} currentItem - The current item whose code is being updated.
	 * @param {any[]} itemsCache - The cache containing related items.
	 * @returns {void} This method does not return anything.
	 */
	// public changeCode(currentItem: unknown, itemsCache: unknown[]): void {
	// 	let fields: { field: string; readonly: boolean }[] = [];
	// 	let item = itemsCache.find((cacheItem) => cacheItem.Id === currentItem.Id);

	// 	if (item) {
	// 		if (item.IsLookup) {
	// 			if (item.Code === currentItem.Code) {
	// 				currentItem.IsLookup = item.IsLookup;
	// 				currentItem.EstRuleParamValueFk = item.EstRuleParamValueFk;
	// 				currentItem.ParameterValue = item.ParameterValue;
	// 				currentItem.ValueDetail = item.ValueDetail;

	// 				fields.push({ field: 'ValueDetail', readonly: true });
	// 				fields.push({ field: 'ParameterValue', readonly: true });
	// 				fields.push({ field: 'EstRuleParamValueFk', readonly: false });
	// 			} else {
	// 				currentItem.IsLookup = false;
	// 				currentItem.EstRuleParamValueFk = null;

	// 				fields.push({ field: 'ValueDetail', readonly: false });
	// 				fields.push({ field: 'ParameterValue', readonly: false });
	// 				fields.push({ field: 'EstRuleParamValueFk', readonly: true });
	// 			}
	// 		} else if (item.ValueType === 1 && item.Code === currentItem.Code) {
	// 			currentItem.ParameterValue = item.ParameterValue;
	// 			currentItem.ValueDetail = item.ValueDetail;
	// 		} else if (item.ValueType === 2 && item.Code === currentItem.Code) {
	// 			currentItem.ParameterValue = item.ParameterValue;
	// 		}

	// 		// this.estimateMainDetailsParamImageProcessor.select(item); todo
	// 	}

	// 	if (fields.length > 0) {
	// 		//this.platformRuntimeDataService.readonly(currentItem, fields); todo
	// 	}
	// }

	/**
	 * Updates the assigned structure ID of a current item and its related items in the cache.
	 * @param {any} currentItem - The current item whose assigned structure ID is being updated.
	 * @param {any[]} itemsCache - The cache containing related items.
	 * @returns {void} This method does not return anything.
	 */
	// public changeAssignedStructureId(currentItem: any, itemsCache: any[]): void {
	// 	// todo
	// 	// let item = currentItem.AssignedStructureId === inject(estimateMainParamStructureConstant).BasCostGroup ?
	// 	//   itemsCache.find(cacheItem => cacheItem.originId === currentItem.originId) :
	// 	//   itemsCache.find(cacheItem => cacheItem.Id === currentItem.Id);
	// 	// if (item && item.AssignedStructureId === currentItem.AssignedStructureId) {
	// 	//   currentItem.Version = item.Version;
	// 	// } else {
	// 	//   currentItem.Version = -1;
	// 	// }
	// 	// this.estimateMainDetailsParamImageProcessor.select(item);
	// }

	/**
	 * Disables tools identified by their IDs within a specified scope.
	 * @param {IGridContainerLink<any>} containerLink - containes container tool data
	 * @param {string[]} toolsIds - An array of tool IDs to be disabled.
	 * @returns {void} This method does not return anything.
	 */
	// public disableTools(containerLink: IGridContainerLink<any>, toolsIds: string[]): void {
	// 	// todo (disable method is not implmented yet)
	// 	// containerLink.uiAddOns.toolbar.forEach(tool => {
	// 	//     let indexOf = toolsIds.findIndex(item => item === tool.id);
	// 	//     tool.disabled = indexOf < 0 ? tool.disabled : () => true;
	// 	// });
	// }

	/**
	 * Checks detail formula parameters based on the provided entity, value, model, data service, detail value, async marker, and service.
	 * @param entity
	 * @param value
	 * @param model
	 * @param dataService
	 * @param detailVal
	 * @param asyncMarker
	 * @param service
	 * @returns {Observable<any>} This method returns Observable<any>.
	 */
	// public checkDetailFormulaParameter(entity: IEntity, value: any, model: string, dataService: any, detailVal: string, asyncMarker: any, service: any): Observable<any> {
	// 	return this.estimateMainCommonFeaturesCheckDetailFormulaParameterService.checkDetailFormulaParameter(entity, value, model, dataService, detailVal, asyncMarker, service);
	// }

	/**
	 *  Handles the change event for a specific field in an entity.
	 * @param field
	 * @param entity
	 * @returns This method does not return anything
	 */
	public fieldChanged(field: string, entity: IEntity): void {
		return this.estimateMainCommonFeaturesFieldChangedService.fieldChanged(field, entity);
	}

	/**
	 *
	 * @param dataServName
	 * @param options
	 * @param entity
	 * @param model
	 * @param value
	 * @returns This method does not return anything
	 */
	// public calculateOnChange(dataServName: string, options: any, entity: IEntity, model: any, value: any): void {
	// 	return this.estimateMainCommonFeaturesCalculateOnChangeService.calculateOnchange(dataServName, options, entity, model, value);
	// }
}
