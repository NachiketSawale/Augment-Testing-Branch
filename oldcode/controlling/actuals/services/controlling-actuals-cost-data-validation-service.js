/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'controlling.actuals';

	/**
	 * @ngdoc service
	 * @name controllingActualsCostDataValidationService
	 * @function
	 *
	 * @description
	 * This service provides validation methods of controlling-actuals
	 */
	angular.module(moduleName).factory('controllingActualsCostDataValidationService', ['_','$rootScope', 'platformDataValidationService',
		'platformRuntimeDataService', '$translate', 'controllingActualsCostDataListService',
		function (_,$rootScope, platformDataValidationService, platformRuntimeDataService, $translate, dataService) {
			let service = {};

			service.validateMdcControllingUnitFk = function validateMdcControllingUnitFk(entity, value) {
				let result;
				let fieldErrorTr = {fieldName: 'Controlling Unit'};

				let checkValue = value === -1 ? null : value;

				result = platformDataValidationService.isMandatory(checkValue, 'MdcControllingUnitFk', fieldErrorTr);

				if(result.valid){
					result = checkRepeated(entity, value, 'MdcControllingUnitFk');
				}

				return platformDataValidationService.finishValidation(result, entity, checkValue, 'MdcControllingUnitFk', service, dataService);
			};
			service.validateMdcCostCodeFk = function validateMdcCostCodeFk(entity, value) {
				let result;

				let mdcCostCode = $rootScope.parentEntity;
				let fieldErrorTr = {fieldName: 'Cost Code'};

				if (value === -1) {
					result = platformDataValidationService.isMandatory(null, 'MdcCostCodeFk', fieldErrorTr);
					if(mdcCostCode!==undefined && mdcCostCode.HasCostCode === false)
					{
						result.valid = true;

					}
					else {
						if(entity.MdcCostCodeFk !== null) {
							result.valid = true;
						}
					}

					if(result.valid){
						result = checkRepeated(entity, value, 'MdcCostCodeFk');
					}

					return platformDataValidationService.finishValidation(result, entity, null, 'MdcCostCodeFk', service, dataService);
				} else {
					result = platformDataValidationService.isMandatory(value, 'MdcCostCodeFk', fieldErrorTr);
					if(mdcCostCode!==undefined && mdcCostCode.HasCostCode === false)
					{
						result.valid = true;

					}
					else {
						if(entity.MdcCostCodeFk !== null) {
							result.valid = true;
						}
					}

					if(result.valid){
						result = checkRepeated(entity, value, 'MdcCostCodeFk');
					}

					return platformDataValidationService.finishValidation(result, entity, value, 'MdcCostCodeFk', service, dataService);
				}
			};
			service.validateMdcContrCostCodeFk = function validateMdcContrCostCodeFk(entity, value) {
				let result;
				let mdcContCostCode = $rootScope.parentEntity;
				let fieldErrorTr = {fieldName: 'Controlling Cost Code'};

				if (value === -1) {
					result = platformDataValidationService.isMandatory(null, 'MdcContrCostCodeFk', fieldErrorTr);
					if(mdcContCostCode!==undefined && mdcContCostCode.HasContCostCode === false)
					{
						result.valid = true;
					}
					else {
						if(entity.MdcContrCostCodeFk !== null) {
							result.valid = true;
						}
					}

					if(result.valid){
						result = checkRepeated(entity, value, 'MdcContrCostCodeFk');
					}

					return platformDataValidationService.finishValidation(result, entity, null, 'MdcContrCostCodeFk', service, dataService);
				} else {
					result = platformDataValidationService.isMandatory(value, 'MdcContrCostCodeFk', fieldErrorTr);
					if(mdcContCostCode!==undefined && mdcContCostCode.HasContCostCode === false)
					{
						result.valid = true;

					}
					else {
						if(entity.MdcContrCostCodeFk !== null) {
							result.valid = true;
						}
					}

					if(result.valid){
						result = checkRepeated(entity, value, 'MdcContrCostCodeFk');
					}

					return platformDataValidationService.finishValidation(result, entity, value, 'MdcContrCostCodeFk', service, dataService);
				}
			};
			service.validateAccountFk = function validateAccountFk(entity, value) {
				let result;
				let account= $rootScope.parentEntity;
				let fieldErrorTr = {fieldName: 'Account'};

				if (value === -1) {
					result = platformDataValidationService.isMandatory(null, 'AccountFk', fieldErrorTr);
					if(account!==undefined && account.HasAccount === false)
					{
						result.valid = true;

					}
					else {
						if(entity.AccountFk !== null) {
							result.valid = true;
						}
					}

					if(result.valid){
						result = checkRepeated(entity, value, 'AccountFk');
					}

					return platformDataValidationService.finishValidation(result, entity, null, 'AccountFk', service, dataService);
				} else {
					result = platformDataValidationService.isMandatory(value, 'AccountFk', fieldErrorTr);
					if(account!==undefined && account.HasAccount === false)
					{
						result.valid = true;

					}
					else {
						if(entity.AccountFk !== null) {
							result.valid = true;
						}
					}

					if(result.valid){
						result = checkRepeated(entity, value, 'AccountFk');
					}

					return platformDataValidationService.finishValidation(result, entity, value, 'AccountFk', service, dataService);
				}
			};

			service.validateNominalDimension1 = function (entity, value){
				let result = checkRepeated(entity, value, 'NominalDimension1');
				return platformDataValidationService.finishValidation(result, entity, value, 'NominalDimension1', service, dataService);
			};

			service.validateNominalDimension2 = function (entity, value){
				let result = checkRepeated(entity, value, 'NominalDimension2');
				return platformDataValidationService.finishValidation(result, entity, value, 'NominalDimension2', service, dataService);
			};

			service.validateNominalDimension3 = function (entity, value){
				let result = checkRepeated(entity, value, 'NominalDimension3');
				return platformDataValidationService.finishValidation(result, entity, value, 'NominalDimension3', service, dataService);
			};

			service.validateUomFk = function (entity, value){
				let result = checkRepeated(entity, value, 'UomFk');
				return platformDataValidationService.finishValidation(result, entity, value, 'UomFk', service, dataService);
			};

			function checkRepeated(entity, value, field){
				entity[field] = value;
				dataService.addRepeatCheckKey(entity);

				let item = _.find(dataService.getList(), function (item) {
					return _.get(item, 'RepeatCheckKey') === entity.RepeatCheckKey && item.Id !== entity.Id;
				});

				if(item){
					return platformDataValidationService.createErrorObject('controlling.actuals.errorDataRepeatRecordKey', {object: field.toLowerCase()});
				}

				clearRepeatError(entity, field);
				return platformDataValidationService.createSuccessObject();
			}

			function clearRepeatError(entity, field){
				if(entity.__rt$data && entity.__rt$data.errors){
					let columns = ['MdcControllingUnitFk', 'MdcCostCodeFk', 'MdcContrCostCodeFk', 'AccountFk', 'NominalDimension1', 'NominalDimension2', 'NominalDimension3'];
					_.forEach(columns, function (column){
						if(column !== field) {
							if(entity.__rt$data.errors[column] && entity.__rt$data.errors[column].error$tr$ === 'controlling.actuals.errorDataRepeatRecordKey'){
								delete entity.__rt$data.errors[column];
								platformDataValidationService.finishValidation(true, entity, null, column, service, dataService);
							}
						}
					});
				}
			}

			return service;
		}
	]);
})(angular);