/**
 * Created by balkanci on 21.07.2015.
 */
(function () {
	'use strict';
	angular.module('basics.company').service('basicCompanyNumberValidationService', ['platformDataValidationService', '$injector', '$http', 'globals',

		function (platformDataValidationService, $injector, $http, globals) {

			var self = this;

			self.numberService = $injector.get('basicsCompanyNumberService');

			self.checkForEntry = function checkForEntry(entity, modelValue, field) {

				var result = {
					valid: modelValue !== '',
					error$tr$: 'basics.company.validation.propertyNotFilled'
				};

				platformDataValidationService.finishValidation(result, entity, modelValue, field, self, self.numberService);

				return result;
			};

			self.asyncValidateCheckMask = function asyncValidateCheckMask(entity, modelValue, field) {
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, field, modelValue, self.numberService);
				return $http.get(globals.webApiBaseUrl + 'basics/company/number/validateCheckMask?checkMask=' + modelValue
				).then(function (response) {
					return platformDataValidationService.finishAsyncValidation({
						apply: true,
						valid: response.data,
						error$tr$: 'basics.company.validation.noValidRegEx'
					}, entity,
					modelValue, field, asyncMarker, this, self.numberService);
				},
				function () {
					return platformDataValidationService.finishAsyncValidation({
						apply: false,
						valid: false,
						error$tr$: 'basics.company.validation.noValidRegEx'
					}, entity,
					modelValue, field, asyncMarker, this, self.numberService);
				});
			};
		}
	]);
})();
