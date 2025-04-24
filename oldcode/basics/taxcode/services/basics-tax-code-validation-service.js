/*
 * Created by alm on 08.31.2020.
 */

(function (angular) {
	/*global angular*/
	'use strict';
	var moduleName = 'basics.taxcode';


	angular.module(moduleName).factory('basicsTaxCodeValidationService', ['$http','platformRuntimeDataService', 'platformDataValidationService', 'basicsTaxCodeMainService',
		function ($http,platformRuntimeDataService, platformDataValidationService, dataService) {

			var service = {};

			service.validateCode = function (entity, value, field) {
				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'Code', dataService.getList(), service, dataService);
			};

			service.asyncValidateCode = function asyncValidateCode(entity, value, field) {
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, dataService);
				var url=globals.webApiBaseUrl + 'basics/taxcode/isuniquecode?code=' + value;
				asyncMarker.myPromise = $http.get(url).then(function (response) {
					var res = {};
					if (response.data) {
						res = {apply: true, valid: true, error: ''};
					} else {
						res.valid = false;
						res.apply = true;
						res.error = 'The Code should be unique';
						res.error$tr$ = 'basics.taxcode.uniqCode';
					}
					platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, dataService);

					return res;
				});

				return asyncMarker.myPromise;
			};

			service.validateValidFrom = function (entity, value, model) {
				return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, service, dataService, 'ValidTo');
			};

			service.validateValidTo = function (entity, value, model) {
				return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, service, dataService, 'ValidFrom');
			};



			return service;
		}
	]);
})(angular);
