/**
 * Created by benny on 25.08.2016.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc service
	 * @name estimateAssembliesWicItemValidationService
	 * @description provides validation methods for assemblies2wicitem entities
	 */
	angular.module(moduleName).factory('estimateAssembliesWicItemValidationService', ['$http', '$q', '$translate', '_', 'platformDataValidationService', 'platformRuntimeDataService', 'estimateAssembliesWicItemService',
		function ($http, $q, $translate, _, platformDataValidationService, platformRuntimeDataService, estimateAssembliesWicItemService) {
			let service = {};

			function isNotEmpty(entity, value, field){
				let resMandatory = platformDataValidationService.isMandatory(value, field);
				platformRuntimeDataService.applyValidationResult(resMandatory, entity, field);
				return platformDataValidationService.finishValidation(resMandatory, entity, value, field, service, estimateAssembliesWicItemService);
			}
			service.validateBoqItemFk = function validateBoqItemFk(entity, value, field,fromInitFuntion) {
				// BOQ_LINE_TYPE_FK only Divisions with ‘Position’ or ‘SurchargeItem’
				let linetypes = [0,200,201,202];
				if(entity && angular.isDefined(entity.BoqLineTypeFk)){
					let correctlyType = _.includes(linetypes, entity.BoqLineTypeFk);
					if(!correctlyType) {
						let result = platformDataValidationService.createErrorObject('estimate.assemblies.errors.wicBoqItemReferenceTypeError', {object: 'Reference'});
						result.error = $translate.instant('estimate.assemblies.errors.wicBoqItemReferenceTypeError');

						if(!fromInitFuntion){
							platformRuntimeDataService.applyValidationResult(result, entity, field);
							return platformDataValidationService.finishValidation(result, entity, null, field, service, estimateAssembliesWicItemService);
						}else{
							return platformRuntimeDataService.applyValidationResult(result, entity, field);
						}
					}
				}
				return isNotEmpty(entity, value, field);
			};

			service.validateBoqWicCatBoqFk = function validateBoqWicCatBoqFk(entity, value, field) {
				let result = isNotEmpty(entity, value, field);
				if(!entity.BoqItemFk){
					service.validateBoqItemFk(entity, entity.BoqItemFk, 'BoqItemFk');
				}
				let fields = [
					{field: 'BoqItemFk', readonly: !value}
				];
				platformRuntimeDataService.readonly(entity, fields);
				return result;
			};

			// make sure only one item from one group, unique per WIC-Group
			service.validateBoqWicCatFk = function validateBoqWicCatFk(entity, value, field) {
				let fieldErrorTr = { fieldName: $translate.instant('estimate.main.' + field) };
				let result = platformDataValidationService.isUniqueAndMandatory(estimateAssembliesWicItemService.getList(), 'BoqWicCatFk', value, entity.Id, fieldErrorTr);
				platformRuntimeDataService.applyValidationResult(result, entity, field);
				let res = platformDataValidationService.finishValidation(result, entity, value, field, service, estimateAssembliesWicItemService);

				if(!entity.BoqWicCatBoqFk){
					service.validateBoqWicCatBoqFk(entity, entity.BoqWicCatBoqFk, 'BoqWicCatBoqFk');
				}
				let fields = [
					{field: 'BoqWicCatBoqFk', readonly: !value}
				];
				platformRuntimeDataService.readonly(entity, fields);

				return res;

			};
			return service;
		}

	]);

})();
