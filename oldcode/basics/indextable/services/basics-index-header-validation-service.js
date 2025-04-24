/**
 * Created by xia on 5/8/2019.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
     * @ngdoc service
     * @name basicsIndexHeaderValidationService
     * @description provides validation methods for site instances
     */
	let moduleName = 'basics.indextable';
	angular.module(moduleName).factory('basicsIndexHeaderValidationService', ['$http', '$q', 'platformDataValidationService','basicsIndexHeaderService',
		function ($http, $q, platformDataValidationService, basicsIndexHeaderService) {
			let service = {};

			service.validateCode = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, basicsIndexHeaderService);
			};

			service.asyncValidateCode = function asyncValidateCode(entity, value, field) {

				// asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
				let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, basicsIndexHeaderService);
				// Now the data service knows there is an outstanding asynchronous request.

				// var postData = {Code: value};

				asyncMarker.myPromise = $http.get(globals.webApiBaseUrl + 'basics/indexheader/isuniquecode?code=' + value).then(function (response) {
					//Interprete result.
					let res = {};
					if (response.data) {
						res = {apply: true, valid: true, error: ''};
					} else {
						res.valid = false;
						res.apply = true;
						res.error = '...';
						res.error$tr$ = 'basics.indextable.errors.uniqCode';
					}

					// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
					platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, basicsIndexHeaderService);

					// Provide result to grid / form container.
					return res;
				});

				return asyncMarker.myPromise;
			};

			return service;
		}

	]);
})(angular);

