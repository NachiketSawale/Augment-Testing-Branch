/*
 * Created by lcn on 11/4/2021.
 */

(function (angular) {
	/*global angular*/
	/*global globals */
	'use strict';
	var moduleName = 'basics.salestaxcode';


	angular.module(moduleName).factory('basicsSalesTaxCodeValidationService', ['$http', 'platformRuntimeDataService', 'platformDataValidationService', 'basicsSalesTaxCodeMainService',
		function ($http, platformRuntimeDataService, platformDataValidationService, dataService) {

			var service = {};

			service.validateCode = function (entity, value, field) {
				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'Code', dataService.getList(), service, dataService);
			};

			service.asyncValidateCode = function asyncValidateCode(entity, value, field) {
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, dataService);
				var url = globals.webApiBaseUrl + 'basics/salestaxcode/isuniquecode?code=' + value;
				asyncMarker.myPromise = $http.get(url).then(function (response) {
					var res = {};
					if (response.data) {
						res = {apply: true, valid: true, error: ''};
					} else {
						res.valid = false;
						res.apply = true;
						res.error = 'The Code should be unique';
						res.error$tr$ = 'basics.salestaxcode.uniqCode';
					}
					platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, dataService);

					return res;
				});

				return asyncMarker.myPromise;
			};


			return service;
		}
	]);
})(angular);
