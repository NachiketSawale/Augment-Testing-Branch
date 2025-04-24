(function (angular) {
	'use strict';

	function basicsWorkflowActionValidationHelper(_) {
		var service = {};
		var registeredValidations = [];

		service.get = function getValidationHelper() {
			var helper = {};
			helper.errorCount = 0;
			helper.invalidItems = [];
			helper.validateAction = function (item) {
				_.forEach(registeredValidations, function (fn) {
					fn(item, helper.addError);
				});
			};

			helper.addError = function (item, errorMessage) {
				const message = errorMessage.replace(/(\r\n|\n|\r)/gm, '').trim();
				if (message.length > 0) {
					if (!item.hasOwnProperty('rt$data')) {
						item.rt$data = {};
						item.rt$data.errors = [];
					}
					if (!item.rt$data.hasOwnProperty('errors')) {
						item.rt$data.errors = [];
					}

					if (!angular.isArray(item.rt$data.errors)) {
						item.rt$data.errors = [];
					}
					item.rt$data.errors.push(errorMessage);

					helper.errorCount++;
					helper.invalidItems.push(item);
				}
			};

			return helper;
		};

		service.registerActionValidation = function (fn) {
			if (angular.isFunction(fn)) {
				registeredValidations.push(fn);
			}
		};

		return service;
	}

	basicsWorkflowActionValidationHelper.$inject = ['_'];
	angular.module('basics.workflow')
		.factory('basicsWorkflowActionValidationHelper', basicsWorkflowActionValidationHelper);
})(angular);
