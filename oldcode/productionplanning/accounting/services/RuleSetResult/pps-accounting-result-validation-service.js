/**
 * Created by anl on 4/25/2019.
 */
/*jshint -W061*/

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).factory('productionpalnningAccountingResultValidationService', ResultValidationService);

	ResultValidationService.$inject = ['platformDataValidationService',
		'productionplanningAccountingResultDataService',
		'$q',
		'$translate',
		'platformRuntimeDataService'];

	function ResultValidationService(platformDataValidationService, resultDataService,
									 $q,
									 $translate,
									 platformRuntimeDataService) {

		function createService(dataService) {

			dataService = dataService || resultDataService;
			var service = {};

			service.validateComponentTypeFk = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			service.validateResult = function (entity, value, model) {
				if (entity.ComponentTypeFk < 3) {
					var res = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
					platformRuntimeDataService.applyValidationResult(res, entity, model);
					return res;
				}
				else {
					return {apply: true, valid: true, error: ''};
				}
			};

			service.validateQuantityFormula = function (entity, value, model) {
				return formulaValidation(entity, value, model);
			};

			service.validateQuantityFormula2 = function (entity, value, model) {
				return formulaValidation(entity, value, model);
			};

			service.validateQuantityFormula3 = function (entity, value, model) {
				return formulaValidation(entity, value, model);
			};

			service.asyncValidateMaterialGroupFk = function (entity, value, model) {
				var defer = $q.defer();
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);

				asyncMarker.myPromise = defer.promise.then(function (response) {
					return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
				});

				if (value < 0) {
					defer.resolve({
						apply: true,
						valid: false,
						error: $translate.instant('basics.material.error.materialGroupSelectError')
					});
					return asyncMarker.myPromise;
				}

				defer.resolve({
					apply: true, valid: true
				});

				return asyncMarker.myPromise;
			};

			function formulaValidation(entity, value, model) {
				var script = '';
				script += 'var value = 1;\n';

				script += value;
				var res = {};
				try {
					eval(wrap(script));
					res = {apply: true, valid: true, error: ''};
				}
				catch (e) {
					res.valid = false;
					res.apply = true;
					res.error = e.message;
				}
				platformDataValidationService.finishValidation(res, entity, value, model, service, dataService);
				return res;
			}

			function wrap(code) {
				return '(function(){\n' + code + '\n})()';
			}

			return service;
		}

		var serviceCache = {};

		function getService(dataService) {
			var key = dataService.getServiceName();
			if (!serviceCache[key]) {
				serviceCache[key] = createService(dataService);
			}
			return serviceCache[key];
		}

		var service = createService();
		service.getService = getService;
		return service;
	}

})(angular);