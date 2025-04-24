/**
 * Created by zwz on 5/14/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.producttemplate';
	var module = angular.module(moduleName);

	module.factory('productionplanningProducttemplateProductDescriptionValidationServiceFactory', ServiceFactory);
	ServiceFactory.$inject = ['$http', '$q', 'platformDataValidationService', 'platformRuntimeDataService'];

	function ServiceFactory($http, $q, platformDataValidationService,platformRuntimeDataService) {

		var serviceCache = {};

		function create(dataServ) {
			var service = {};

			service.validateCode = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataServ);
			};

			//async validate unique for Code
			service.asyncValidateCode = function (entity, value, model) {
				var defer = $q.defer();
				var result = {
					apply: true,
					valid: true
				};
				if (entity.EngDrawingFk) {
					var url = globals.webApiBaseUrl + 'productionplanning/producttemplate/productdescription/isuniquecode?id=' + entity.Id + '&&parentid=' + entity.EngDrawingFk + '&&code=' + value;
					$http.get(url).then(function (response) {
						//Interprete result.
						if (response.data) {
							result = {apply: true, valid: true, error: ''};
						} else {
							result.valid = false;
							result.apply = true;
							result.error = '...';
							result.error$tr$ = 'productionplanning.producttemplate.errors.uniqProductDescriptionCode';
						}
						defer.resolve(result);
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataServ);

					});
				}
				else {
					defer.resolve(result);
				}

				return defer.promise;
			};

			service.validateMaterialFk = function (entity, value, model) {
				return validateForeignKeyFieldMandatory(entity, value, model, service, dataServ);
			};

			function validateForeignKeyFieldMandatory(entity, value, model, service, dataServ, invalidValues) {
				// check if value is invalid
				var invalidValueArray = [0];// generally, we set value 0 as the invalid value for foreign key field
				if (invalidValues) {
					invalidValueArray = invalidValues;
				}
				if (invalidValueArray.indexOf(value) > -1) {
					value = null;
				}
				// validate mandatory of value
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataServ);
			}

			// remark: Here we don't provide validation function for mandatory fields Quantity,Length,Width,Height,Weight,Area,UomFk,UomLengthFk,UomWidthFk,UomHeightFk,UomWeightFk and UomAreaFk,
			// because value 0 is a valid value for these fields.
			return service;
		}

		function getService(dataService) {
			var key = dataService.getServiceName();
			if (!serviceCache[key]) {
				serviceCache[key] = create(dataService);
			}
			return serviceCache[key];
		}

		return {
			getService: getService
		};
	}
})(angular);