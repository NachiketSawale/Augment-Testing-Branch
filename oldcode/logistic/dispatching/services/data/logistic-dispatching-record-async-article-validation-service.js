/**
 * Created by baf on 01.04.2021
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingRecordValidationService
	 * @description provides validation methods for logistic dispatching record entities
	 */
	angular.module(moduleName).service('logisticDispatchingRecordAsyncArticleValidationService', LogisticDispatchingRecordAsyncArticleValidationService);

	LogisticDispatchingRecordAsyncArticleValidationService.$inject = ['_', '$q', '$http', 'platformRuntimeDataService', 'platformDataValidationService',
		'logisticDispatchingConstantValues', 'logisticDispatchingRecordDataService', 'logisticDispatchingHeaderDataService', 'logisticDispatchingRecordProcessorService'];

	function LogisticDispatchingRecordAsyncArticleValidationService(_, $q, $http, platformRuntimeDataService, platformDataValidationService,
		logisticDispatchingConstantValues, logisticDispatchingRecordDataService, logisticDispatchingHeaderDataService, logisticDispatchingRecordProcessorService) {
		var self = this;

		this.takeOverRecordPriceAndBaseValues = function takeOverRecordPriceAndBaseValues(record, newValues) {
			record.ArticleCode = newValues.ArticleCode;
			record.ArticleDesc = newValues.ArticleDesc;
			record.Description = newValues.Description;
			record.IsBulkPlant = newValues.IsBulkPlant;
			record.UoMFk = newValues.UoMFk;
			record.Material2UomIds = newValues.Material2UomIds;
			logisticDispatchingRecordDataService.setPrice(record, newValues);

			return true;
		};

		this.takeOverDangerProcAndPackage = function takeOverDangerProcAndPackage (record, updated) {
			record.PrcStructureFk = updated.PrcStructureFk;
			record.DangerClassFk = updated.DangerClassFk;
			record.DangerQuantity = updated.DangerQuantity;
			record.UomDangerousGoodFk = updated.UomDangerousGoodFk;
			record.PackageTypeFk = updated.PackageTypeFk;
		};

		this.dispatchResourceValidationResult = function dispatchResourceValidationResult (record, result) {
			return self.takeOverRecordPriceAndBaseValues(record, result);
		};

		this.dispatchPlantValidationResult = function dispatchPlantValidationResult (record, updated, assignments, request) {
			record.WorkOperationTypeFk = updated.WorkOperationTypeFk;
			record.WorkOperationIsHire = updated.WorkOperationIsHire;
			record.WorkOperationIsMinor = updated.WorkOperationIsMinor;
			record.IsBulkPlant = updated.IsBulkPlant;
			if(record.IsBulkPlant) {
				record.Quantity = 0;
				request.validator.validateQuantity(record, record.Quantity, 'Quantity');
			}
			record.PrecalculatedWorkOperationTypeFk = updated.PrecalculatedWorkOperationTypeFk;
			record.IsPreCalcDailyBase = updated.IsPreCalcDailyBase;
			record.PerformingProjectLocationFk = updated.PerformingProjectLocationFk;
			record.ReceivingProjectLocationFk = updated.ReceivingProjectLocationFk;

			self.takeOverDangerProcAndPackage(record, updated);

			if(updated.IsBulkPlant){
				record.Quantity = 0;
				let error = platformDataValidationService.createErrorObject('logistic.dispatching.errors.enterBulkQuantity');
				platformRuntimeDataService.applyValidationResult(error, record, 'Quantity');
				platformDataValidationService.finishValidation(error, record, record.Quantity , 'Quantity', request.validator, request.service);
			}
			logisticDispatchingRecordProcessorService.processItem(record);
			if(updated.WorkOperationTypeFk) {
				platformRuntimeDataService.applyValidationResult(true, record, 'WorkOperationTypeFk');
				platformDataValidationService.finishValidation(true, record, updated.WorkOperationTypeFk, 'WorkOperationTypeFk', request.validator, request.service);
			}
			let newAssignments = _.filter(assignments, r => r.Id !== record.Id);
			request.service.takeOverRecords(newAssignments);
			let res = self.takeOverRecordPriceAndBaseValues(record, updated);
			request.validator.foreignFieldValidatePrecalculatedWorkOperationTypeFk(record,record.PrecalculatedWorkOperationTypeFk,'PrecalculatedWorkOperationTypeFk');
			return res;
		};

		this.dispatchMaterialValidationResult = function dispatchMaterialValidationResult (record, updated, request) {
			self.takeOverDangerProcAndPackage(record, updated);

			record.IsLotManagementMandatory = updated.IsLotManagementMandatory;

			request.validator.handleQuantityOrStockError(record, record.RequiredQuantityIsAvailableInStock);
			request.validator.handleLotManagementMandatoryError(record, !record.IsLotManagementMandatory || record.Lot);
			return self.takeOverRecordPriceAndBaseValues(record, updated);
		};

		this.dispatchSundryServiceValidationResult = function dispatchSundryServiceValidationResult (record, updated) {
			return self.takeOverRecordPriceAndBaseValues(record, updated);
		};

		this.dispatchCostCodeValidationResult = function dispatchCostCodeValidationResult (record, updated) {
			return self.takeOverRecordPriceAndBaseValues(record, updated);
		};

		this.dispatchFabricatedProductValidationResult = function dispatchFabricatedProductValidationResult (record, updated) {
			record.MaterialFk = updated.MaterialFk;
			return self.takeOverRecordPriceAndBaseValues(record, updated);
		};

		this.dispatchValidationResult = function dispatchValidationResult(request, result) {
			var record = request.dispatchRecord;
			var res;
			var updated = _.find(result.data, function(item) {
				return item.Id === record.Id;
			});
			switch(request.dispatchRecord.RecordTypeFk) {
				case logisticDispatchingConstantValues.record.type.resource: res = self.dispatchResourceValidationResult(record, updated); break;
				case logisticDispatchingConstantValues.record.type.plant: res = self.dispatchPlantValidationResult(record, updated, result.data, request); break;
				case logisticDispatchingConstantValues.record.type.material: res = self.dispatchMaterialValidationResult(record, updated, request); break;
				case logisticDispatchingConstantValues.record.type.sundryService: res = self.dispatchSundryServiceValidationResult(record, updated); break;
				case logisticDispatchingConstantValues.record.type.costCode: res = self.dispatchCostCodeValidationResult(record, updated); break;
				case logisticDispatchingConstantValues.record.type.fabricatedProduct: res = self.dispatchFabricatedProductValidationResult(record, updated); break;
			}

			return res;
		};

		this.validateRecordArticleAsynchronouosly = function validateRecordArticleAsynchronouosly(request) {
			var callData = {
				Header: logisticDispatchingHeaderDataService.getSelected(),
				Record: request.dispatchRecord,
				ArticleChanged: true,
				NewValue: request.newArticle
			};
			return $http.post(globals.webApiBaseUrl + 'logistic/dispatching/record/validate', callData).then(function(result) {
				return self.dispatchValidationResult(request, result);
			});
		};
	}
})(angular);
