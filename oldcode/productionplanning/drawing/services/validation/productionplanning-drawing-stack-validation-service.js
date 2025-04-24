(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).service('productionplanningDrawingStackValidationService', StackValidationService);
	StackValidationService.$inject = ['$http', 'platformDataValidationService'];

	function StackValidationService($http, platformDataValidationService) {

		var serviceCache = {};

		function createValidationService(dataService) {

			var service = {};

			service.validateCode = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			service.asyncValidateCode = function (entity, value, field) {
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, dataService);

				var postData = {
					StackId: entity.Id,
					DrawingId: entity.EngDrawingFk,
					Code: value
				};

				asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'productionplanning/drawing/stack/isuniquecode', postData).then(
					function (response) {
						var res = {};
						if (response.data) {
							res = {apply: true, valid: true, error: ''};
						} else {
							res.valid = false;
							res.apply = true;
							res.error = 'The Code should be unique';
							res.error$tr$ = 'productionplanning.item.validation.errors.uniqCode';
						}

						platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, dataService);

						return res;
					});

				return asyncMarker.myPromise;
			};

			service.validateUomLengthFk = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			service.validateUomWidthFk = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			service.validateUomHeightFk = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			service.validateUomWeightFk = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			return service;
		}

		function getService(dataService) {
			var key = dataService.getServiceName();
			if (!serviceCache[key]) {
				serviceCache[key] = createValidationService(dataService);
			}
			return serviceCache[key];
		}

		return {
			getService: getService
		};
	}
})
();
