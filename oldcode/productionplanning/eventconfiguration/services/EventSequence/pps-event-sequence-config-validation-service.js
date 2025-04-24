/**
 * Created by anl on 6/5/2019.
 */

/*jshint -W061*/
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.eventconfiguration';

	angular.module(moduleName).factory('productionpalnningEventconfigurationSequenceValidationService', EventSequenceValidationService);

	EventSequenceValidationService.$inject = [
		'$q', 'platformDataValidationService',
		'productionplanningEventconfigurationSequenceDataService',
		'$translate'];

	function EventSequenceValidationService(
		$q, platformDataValidationService,
		sequenceDataService,
		$translate) {

		var service = {};

		service.validateMaterialGroupFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, sequenceDataService);
		};

		service.validateSiteFk = function (entity, value, model) {
			if(!entity.IsTemplate) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, sequenceDataService);
			}
		};

		service.validateQuantityFormula = function (entity, value, model) {
			return formulaValidation(entity, value, model);
		};

		function formulaValidation(entity, value, model) {
			var script = '';
			script += 'var value = 1;\n';

			script += value;
			var res = {};
			try {
				eval(wrap(script));
				res = {apply: true, valid: true, error: ''};
			} catch (e) {
				res.valid = false;
				res.apply = true;
				res.error = e.message;
			}
			platformDataValidationService.finishValidation(res, entity, value, model, service, sequenceDataService);
			return res;
		}

		function wrap(code) {
			return '(function(){\n' + code + '\n})()';
		}

		service.asyncValidateMaterialGroupFk = function (entity, value, model) {
			return asyncMDCGroupFk(entity, value, model);
		};

		// service.asyncValidateMaterialGroupOverFk = function (entity, value, model) {
		// 	return asyncMDCGroupFk(entity, value, model);
		// };

		function asyncMDCGroupFk(entity, value, model){
			var defer = $q.defer();
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, sequenceDataService);

			asyncMarker.myPromise = defer.promise.then(function (response) {
				return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, sequenceDataService);
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
		}

		return service;
	}

})(angular);
