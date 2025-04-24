/**
 * Created by bh on 28.05.2020
 */

(function (angular) {
	/* global _ */
	'use strict';

	/**
	 * @ngdoc service
	 * @name boqMainBillToValidationServiceProvider
	 * @description provides validation methods for boq main billTo entities
	 */
	angular.module('boq.main').factory('boqMainBillToValidationServiceProvider', ['platformValidationServiceFactory', 'platformRuntimeDataService', 'platformDataValidationService',
		function (platformValidationServiceFactory, platformRuntimeDataService, platformDataValidationService) {

			var ValidationServiceProvider = function (boqBillToDataService) {
				var self = this;
				var billToScheme = {typeName: 'BoqBillToDto', moduleSubModule: 'Boq.Main'};
				platformValidationServiceFactory.addValidationServiceInterface(billToScheme, {
					mandatory: platformValidationServiceFactory.determineMandatoryProperties(billToScheme),
					uniques: ['Code', 'PrjBillToId']
				},
				self,
				boqBillToDataService);
			};

			var service = {};
			var latestCreatedValidationService = null;

			service.getInstance = function getInstance(boqBillToDataService) {

				latestCreatedValidationService = new ValidationServiceProvider(boqBillToDataService);

				latestCreatedValidationService.validateQuantityPortion = function validateQuantityPortion(entity, value, model) {

					function finishValidation(service){
						return platformDataValidationService.finishValidation({
							apply: true,
							valid: false,
							error$tr$: 'project.main.errQuantityTotalGreaterAsHundred'
						}, entity, value, model, service, boqBillToDataService);
					}

					var items = boqBillToDataService.getList();
					if(value > 100.0) {
						return finishValidation(this);
					} else {
						var sumOfQuantityPortion = value;

						_.forEach(items, function(item) {
							if(item.Id !== entity.Id) {
								sumOfQuantityPortion += item.QuantityPortion;
							}
						});
						_.forEach(items, function(item) {
							item.TotalQuantity = sumOfQuantityPortion;
							if(item.Id !== entity.Id) {
								boqBillToDataService.fireItemModified(item);
							}
						});

						if(sumOfQuantityPortion > 100.0) {
							entity.IsMarkedForTotalQuantityGreaterAsHundred = true;
							return finishValidation(this);
						} else {
							_.forEach(items, function(item) {
								if(item.IsMarkedForTotalQuantityGreaterAsHundred) {
									item.IsMarkedForTotalQuantityGreaterAsHundred = false;
									platformDataValidationService.finishValidation({
										apply: true,
										valid: true
									}, item, item.QuantityPortion, model, this, boqBillToDataService);
								}
							});
						}
					}
					_.forEach(items, function(item) {
						platformRuntimeDataService.applyValidationResult({
							apply: true,
							valid: true
						},
						item, 'QuantityPortion');
						boqBillToDataService.fireItemModified(item);
					});

					return platformDataValidationService.finishValidation({
						apply: true,
						valid: true
					}, entity, value, model, this, boqBillToDataService);

				};

				return latestCreatedValidationService;
			};

			service.getLatestCreatedValidationService = function getLatestCreatedValidationService() {
				return latestCreatedValidationService;
			};

			return service;
		}]);
})(angular);
