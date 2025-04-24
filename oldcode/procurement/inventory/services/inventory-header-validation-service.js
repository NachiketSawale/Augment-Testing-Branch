/**
 * Created by pel on 7/5/2019.
 */
// eslint-disable-next-line no-redeclare
/* global angular */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.inventory';

	/**
	 * @ngdoc service
	 * @name inventoryHeaderElementValidationService
	 * @description provides validation methods for a InventoryHeader
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('inventoryHeaderElementValidationService',
		['$translate', '$q', '$http', 'procurementInventoryHeaderDataService',
			'platformDataValidationService', 'basicsLookupdataLookupDataService',
			'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService', 'platformModalService',
			'procurementInventoryDataService', 'cloudDesktopPinningContextService',
			function ($translate, $q, $http, inventoryHeaderDataService, platformDataValidationService,
				basicsLookupdataLookupDataService, platformRuntimeDataService, basicsLookupdataLookupDescriptorService,
				platformModalService, procurementInventoryDataService, cloudDesktopPinningContextService) {
				var service = {};
				// var self = this;
				service.validatePrjProjectFk = validatePrjProjectFk;
				service.validateInventoryDate = validateInventoryDate;
				service.validateTransactionDate = validateTransactionDate;
				service.validatePrcStockTransactionTypeFk = validatePrcStockTransactionTypeFk;
				service.validatePrjStockFk = validatePrjStockFk;

				function validatePrjProjectFk(entity, value, model) {
					// var oldProjectFk = entity.PrjProjectFk;
					if (entity.PrjProjectFk === 0 && value === 0) {
						// set project  from pinning project
						var item = cloudDesktopPinningContextService.getPinningItem('project.main');
						if (item) {
							entity.PrjProjectFk = item.id;
							value = item.id;
						}
					}
					var fieldName = model === 'PrjProjectFk' ? $translate.instant('procurement.inventory.header.entityProjectNo') : 'Project No.';
					var result = platformDataValidationService.isMandatory(value, model, {fieldName: fieldName});
					if (result.valid === true && value === 0) {
						result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName});
					}
					if (value !== 0 && entity.PrjProjectFk !== value) {
						entity.PrjStockFk = 0;
						validatePrjStockFk(entity, 0, 'PrjStockFk');
					}

					platformDataValidationService.finishValidation(result, entity, value, model, service, inventoryHeaderDataService);
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return result;
				}

				function validateInventoryDate(entity, value, model) {
					var fieldName = model === 'InventoryDate' ? $translate.instant('procurement.inventory.header.inventoryDate') : 'Inventory Date';
					var result = platformDataValidationService.isMandatory(value, model, {fieldName: fieldName});
					if (result.valid === true && value === null) {
						result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName});
					}
					if (value !== null && entity.TransactionDate === null) {
						entity.TransactionDate = value;
						platformRuntimeDataService.applyValidationResult(true, entity, 'TransactionDate');
					}

					platformDataValidationService.finishValidation(result, entity, value, model, service, inventoryHeaderDataService);
					return result;
				}

				function validateTransactionDate(entity, value, model) {
					var fieldName = model === 'TransactionDate' ? $translate.instant('procurement.inventory.header.transactionDate') : 'Transaction Date';
					var result = platformDataValidationService.isMandatory(value, model, {fieldName: fieldName});
					if (result.valid === true && value === null) {
						result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName});
					}

					platformDataValidationService.finishValidation(result, entity, value, model, service, inventoryHeaderDataService);
					return result;
				}

				function validatePrcStockTransactionTypeFk(entity, value, model) {
					var fieldName = model === 'PrcStockTransactionTypeFk' ? $translate.instant('procurement.inventory.header.prcStockTransactionTypeFk') : 'Stock Transaction Type';
					var result = platformDataValidationService.isMandatory(value, model, {fieldName: fieldName});
					if (result.valid === true && value === 0) {
						result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName});
					}

					platformDataValidationService.finishValidation(result, entity, value, model, service, inventoryHeaderDataService);
					return result;
				}

				function validatePrjStockFk(entity, value, model) {
					var fieldName = model === 'PrjStockFk' ? $translate.instant('procurement.inventory.header.prjStockFk') : 'Stock Code';
					var result = platformDataValidationService.isMandatory(value, model, {fieldName: fieldName});
					if (result.valid === true && value === 0) {
						result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName});
					}
					platformRuntimeDataService.applyValidationResult(result, entity, 'PrjStockFk');
					platformDataValidationService.finishValidation(result, entity, value, model, service, inventoryHeaderDataService);
					return result;
				}

				function createErrorObject(transMsg, errorParam) {
					return {
						apply: true,
						valid: false,
						error: '...',
						error$tr$: transMsg,
						error$tr$param$: errorParam
					};
				}

				return service;
			}
		]);

})(angular);
