(function (angular) {
	'use strict';

	/**
     * @ngdoc service
     * @name basicsSiteValidationService
     * @description provides validation methods for site instances
     */
	var moduleName = 'basics.site';
	angular.module(moduleName).factory('basicsSiteValidationService', ['$http', '$q', 'platformDataValidationService','basicsSiteMainService',
		function ($http, $q, platformDataValidationService,basicsSiteMainService) {
			var service = {};

			service.validateCode = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, basicsSiteMainService);
			};

			service.asyncValidateCode = function asyncValidateCode(entity, value, field) {

				//asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, basicsSiteMainService);
				//Now the data service knows there is an outstanding asynchronous request.

				var postData = {Id: entity.Id, Code: value};

				asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'basics/site/isuniquecode', postData).then(function (response) {
					//Interprete result.
					var res = {};
					if (response.data) {
						res = {apply: true, valid: true, error: ''};
					} else {
						res.valid = false;
						res.apply = true;
						res.error = '...';
						res.error$tr$ = 'basics.site.errors.uniqCode';
					}

					//Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
					platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, basicsSiteMainService);

					//Provide result to grid / form container.
					return res;
				});

				return asyncMarker.myPromise;
			};

			return service;
		}

	]);
})(angular);
