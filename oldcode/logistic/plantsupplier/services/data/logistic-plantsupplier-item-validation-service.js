/**
 * Created by Shankar on 28.09.2022
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'logistic.plantsupplier';

	/**
	 * @ngdoc service
	 * @name logisticPlantSupplyItemValidationService
	 * @description provides validation methods for logistic plant supplier item entities
	 */
	angular.module(moduleName).service('logisticPlantSupplyItemValidationService', LogisticPlantSupplyItemValidationService);

	LogisticPlantSupplyItemValidationService.$inject = [
		'_', '$q', '$http', 'platformDataValidationService', 'platformValidationServiceFactory', 'logisticPlantSupplierConstantValues',
		'logisticPlantSupplyItemDataService', 'logisticPlantSupplierDataService', 'logisticPlantSupplierItemReadonlyProcessor',
		'platformRuntimeDataService'
	];

	function LogisticPlantSupplyItemValidationService(
		_, $q, $http, platformDataValidationService, platformValidationServiceFactory, logisticPlantSupplierConstantValues,
		logisticPlantSupplyItemDataService, logisticPlantSupplierDataService, logisticPlantSupplierItemReadonlyProcessor,
		platformRuntimeDataService
	) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticPlantSupplierConstantValues.schemes.plantSupplyItem, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticPlantSupplierConstantValues.schemes.plantSupplyItem)
		},
		self,
		logisticPlantSupplyItemDataService);

		this.validateAdditionalJobFk = function validateAdditionalJobFk(entity, value) {
			entity.JobFk = value;
			logisticPlantSupplierItemReadonlyProcessor.processItem(entity);
			return true;
		};

		this.asyncValidateMaterialFk = function asyncValidateMaterialFk(entity, value, model) {
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticPlantSupplyItemDataService);

			let callData = {
				Supplier: logisticPlantSupplierDataService.getSelected(),
				Item: entity,
				MaterialChange: true,
				NewIntValue: value
			};
			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'logistic/plantsupplier/item/validate', callData).then(function(data) {
				var result = data.data;
				if(result.ValidationResult)
				{
					entity.Price = result.Item.Price;
				}

				return platformDataValidationService.finishAsyncValidation({
					valid: result.ValidationResult,
					apply: true,
					error$tr$param: {}
				}, entity, value, model, asyncMarker, self, logisticPlantSupplyItemDataService);
			});

			return asyncMarker.myPromise;
		};

		this.asyncValidateJobFk = function asyncValidateJobFk(entity, value, model) {
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticPlantSupplyItemDataService);

			let callData = {
				Id: value
			};
			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'logistic/job/instance', callData).then(function(data) {
				let job = data.data;
				entity.PlantFk = job.PlantFk;
				platformRuntimeDataService.applyValidationResult(!!job.PlantFk, entity, 'PlantFk');
				self.validatePlantFk(entity, job.PlantFk, 'PlantFk');

				return platformDataValidationService.finishAsyncValidation({
					valid: true,
					apply: true,
					error$tr$param: {}
				}, entity, value, model, asyncMarker, self, logisticPlantSupplyItemDataService);
			});

			return asyncMarker.myPromise;
		};

		this.asyncValidateQuantity = function asyncValidateQuantity(entity, value, model) {
			if(entity.JobFk === 0 || entity.MaterialFk === 0) {
				return $q.when({
					valid: true,
					apply: true,
					error$tr$param: {}
				});
			}

			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticPlantSupplyItemDataService);

			let callData = {
				Supplier: logisticPlantSupplierDataService.getSelected(),
				Item: entity,
				MaterialChange: true,
				NewDecimalValue: value
			};

			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'logistic/plantsupplier/item/validate', callData).then(function(data) {
				var result = data.data;
				if(result.ValidationResult)
				{
					entity.Price = result.Item.Price;
				}

				return platformDataValidationService.finishAsyncValidation({
					valid: result.ValidationResult,
					apply: true,
					error$tr$param: {}
				}, entity, value, model, asyncMarker, self, logisticPlantSupplyItemDataService);
			});

			return asyncMarker.myPromise;
		};

		this.asyncValidateConsumptionDate = function asyncValidateConsumptionDate(entity, value, model) {
			if(entity.JobFk === 0 || entity.MaterialFk === 0) {
				return $q.when({
					valid: true,
					apply: true,
					error$tr$param: {}
				});
			}

			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticPlantSupplyItemDataService);

			let callData = {
				Supplier: logisticPlantSupplierDataService.getSelected(),
				Item: entity,
				MaterialChange: true,
				NewDateTimeValue: value
			};

			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'logistic/plantsupplier/item/validate', callData).then(function(data) {
				var result = data.data;
				if(result.ValidationResult)
				{
					entity.Price = result.Item.Price;
				}

				return platformDataValidationService.finishAsyncValidation({
					valid: result.ValidationResult,
					apply: true,
					error$tr$param: {}
				}, entity, value, model, asyncMarker, self, logisticPlantSupplyItemDataService);
			});

			return asyncMarker.myPromise;
		};
	}
})(angular);
