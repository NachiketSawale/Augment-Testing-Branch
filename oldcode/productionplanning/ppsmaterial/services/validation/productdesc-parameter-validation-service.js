(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name ppsMaterialProductDescParameterValidationService
	 * @description provides validation methods for master instances
	 */
	var moduleName = 'productionplanning.ppsmaterial';
	angular.module(moduleName).factory('productionplanningPpsMaterialProductDescParameterValidationService', productionplanningPpsMaterialProductDescParameterValidationService);

	productionplanningPpsMaterialProductDescParameterValidationService.$inject = ['platformDataValidationService',
		'$http', '$q', '$injector'];

	function productionplanningPpsMaterialProductDescParameterValidationService(platformDataValidationService,
																				$http, $q, $injector) {

		function createNewComplete(dataService) {
			var service = {};
			service.validateUomFk = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			service.validateVariableName = function (entity, value, model) {
				var itemList = dataService.getList();
				service.isCodeUnique = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, itemList, service, dataService);
				return service.isCodeUnique;
			};

			service.asyncValidateVariableName = function (entity, value) {

				var url = globals.webApiBaseUrl + 'productionplanning/ppsmaterial/mdcproductdescparam/isuniquevariablename?currentId=' + entity.Id + '&productDescriptionId=' + entity.ProductDescriptionFk + '&variableName=' + value;

				var defer = $q.defer();
				$http.get(url).then(function (result) {
					defer.resolve(!result.data ? platformDataValidationService.createErrorObject('productionplanning.ppsmaterial.productDescParameter.errorVariableNameMustBeUnique') : true);
				});

				return defer.promise;

			};

			return service;
		}

		var service = {};

		var serviceCache = {};

		service.getService = function getService(dataService) {
			if (!dataService) {//default data service
				dataService = $injector.get('productionplanningPpsMaterialProductDescParameterDataService');
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
