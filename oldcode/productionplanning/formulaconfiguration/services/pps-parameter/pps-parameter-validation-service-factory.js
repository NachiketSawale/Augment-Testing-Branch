/**
 * Created by anl on 5/5/2022.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).factory('productionplanningFormulaConfigurationParameterValidationServiceFactory', ParameterValidationServiceFactory);

	ParameterValidationServiceFactory.$inject = ['platformDataValidationService', '$http', 'ppsFormulaConfigurationDomainTypes'];

	function ParameterValidationServiceFactory(platformDataValidationService, $http, ppsFormulaConfigurationDomainTypes) {
		var serviceCache = {};

		function getService(options) {
			if(!serviceCache[options.dataService]){
				serviceCache[options.dataService] = createByDataService(options.dataService);
			}
			return serviceCache[options.dataService];
		}

		function createByDataService(dataService) {
			var service = {
				validatePpsFormulaVersionFk: validatePpsFormulaVersionFk,
				validateBasDisplayDomainFk: validateBasDisplayDomainFk,
				validateVariableName: validateVariableName,
				asyncValidateVariableName: asyncValidateVariableName,
			};

			function validatePpsFormulaVersionFk (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			}

			function validateBasDisplayDomainFk (entity, value, model) {
				if(ppsFormulaConfigurationDomainTypes.Text === 0 && value === null){
					return { apply: true, error: '', valid: true };
				}
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			}

			function validateVariableName (entity, value, model) {
				var itemList = dataService.getList();
				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, itemList, service, dataService);
			}

			function asyncValidateVariableName (entity, value, field) {

				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, dataService);

				var postData = {FormulaVersionId: entity.Id, Name: value};

				asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'productionplanning/formulaconfiguration/parameter/validatevariablename',
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

			return service;
		}

		return {
			getService: getService
		};
	}
})(angular);
