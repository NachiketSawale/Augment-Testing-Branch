(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name ppsMaterialProductDescValidationService
	 * @description provides validation methods for master instances
	 */
	var moduleName = 'productionplanning.ppsmaterial';
	angular.module(moduleName).factory('productionplanningPpsMaterialProductDescValidationService', productionplanningPpsMaterialProductDescValidationService);

	productionplanningPpsMaterialProductDescValidationService.$inject = ['platformDataValidationService', '$http',
		'$injector'];

	function productionplanningPpsMaterialProductDescValidationService(platformDataValidationService, $http,
																	   $injector) {

		function createNewComplete(dataService) {
			var service = {};

			service.validateUomFk = service.validateBasUomLengthFk = service.validateBasUomWidthFk =
				service.validateBasUomHeightFk = service.validateBasUomWeightFk = service.validateBasUomAreaFk = service.validateBasUomVolumeFk =
					function (entity, value, model) {
						return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
					};

			service.validateCode = function (entity, value, model) {
				var itemList = dataService.getList();
				service.isCodeUnique = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, itemList, service, dataService);
				return service.isCodeUnique;
			};

			service.asyncValidateCode = function (entity, value, model) {
				var url = globals.webApiBaseUrl + 'productionplanning/ppsmaterial/mdcproductdescription/isuniquecode?currentId=' + entity.Id + '&materialId=' + entity.MaterialFk + '&code=' + value;

				//asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
				//Now the data service knows there is an outstanding asynchronous request.
				asyncMarker.myPromise = $http.get(url).then(function (response) {
					//Interprete result.
					var res = {};
					if (response.data) {
						res = {apply: true, valid: true, error: ''};
					} else {
						res.valid = false;
						res.apply = true;
						res.error = '...';
						res.error$tr$ = 'productionplanning.ppsmaterial.productDescription.errorCodeMustBeUnique';
					}
					//Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
					platformDataValidationService.finishAsyncValidation(res, entity, value, model, asyncMarker, service, dataService);
					//Provide result to grid / form container.
					return res;
				});

				return asyncMarker.myPromise;
			};

			service.validateEngDrawingFk = function (entity, value, model) {
				if (value === 0) {
					value = null;
				}
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			return service;
		}

		var service = {};

		var serviceCache = {};

		service.getService = function getService(dataService) {
			if (!dataService) {//default data service
				dataService = $injector.get('productionplanningPpsMaterialProductDescDataService');
			}
			var serviceKey = dataService.getServiceName();
			if (!serviceCache[serviceKey]) {
				serviceCache[serviceKey] = createNewComplete(dataService);
			}
			return serviceCache[serviceKey];
		};

		return service;
	}
})(angular);
