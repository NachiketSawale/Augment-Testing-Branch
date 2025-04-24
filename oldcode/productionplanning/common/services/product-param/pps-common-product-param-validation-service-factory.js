/**
 * Created by zwz on 7/15/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('productionplanningCommonProductParamValidationServiceFactory', ValidationServiceFactory);

	ValidationServiceFactory.$inject = ['platformDataValidationService', '$http'];

	function ValidationServiceFactory(platformDataValidationService, $http) {
		var serviceCache = {}; // serviceCache uses for store validateServices, and we get validateService by dataService.(dataService is key, validateService is value)

		function getService(options) {
			if(!serviceCache[options.dataService]){
				serviceCache[options.dataService] = createByDataService(options.dataService);
			}
			return serviceCache[options.dataService];
		}

		function createByDataService(dataService) {
			var service = {
				validateVariableName: validateVariableName,
				asyncValidateVariableName: asyncValidateVariableName,
				validateSorting: validateSorting
			};

			function validateVariableName (entity, value, model) {
				var itemList = dataService.getList();
				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, itemList, service, dataService);
			}

			function asyncValidateVariableName (entity, value, field) {

				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, dataService);

				var postData = {Id: entity.Id, Name: value, ProductFk: entity.ProductFk};

				asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'productionplanning/common/product/param/checkname',
					postData).then(function (response) {
					//Interprete result.
					var res = {};
					if (response.data) {
						res = {apply: true, valid: true, error: ''};
					} else {
						res.valid = false;
						res.apply = true;
						res.error = 'The VariableName should be unique';
						res.error$tr$ = 'productionplanning.common.errors.uniqName';
					}
					platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, dataService);

					return res;
				});

				return asyncMarker.myPromise;
			}

			function validateSorting (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			}

			return service;
		}

		return {
			getService: getService
		};
	}
})(angular);
