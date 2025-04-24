(function (angular) {
	'use strict';

	const moduleName = 'basics.common';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsCommonCashFlowProjectionWizardValidationService', [
		'platformRuntimeDataService', 'platformDataValidationService',
		function (platformRuntimeDataService, platformDataValidationService) {
			const service = {};

			service.removeError = function (entity) {
				if (entity.__rt$data && entity.__rt$data.errors) {
					entity.__rt$data.errors = null;
				}
			};

			const self = this;

			self.createErrorObject = function createErrorObject(transMsg, errorParam) {
				return {
					apply: true,
					valid: false,
					error: '...',
					error$tr$: transMsg,
					error$tr$param$: errorParam
				};
			};

			service.validateStartWork = function (entity, value) {
				const result = platformDataValidationService.isMandatory(value, 'start date');
				if (!result.valid) {
					return result;
				}

				if (value && entity.EndWork) {
					if (Date.parse(entity.EndWork) <= Date.parse(value)) {
						return self.createErrorObject('cloud.common.Error_EndDateTooEarlier', {}, true);
					} else {
						service.removeError(entity);
					}
				}
				return true;
			};
			service.validateEndWork = function (entity, value) {
				const result = platformDataValidationService.isMandatory(value, 'end date');
				if (!result.valid) {
					return result;
				}

				if (entity.StartWork && value) {
					if (Date.parse(value) <= Date.parse(entity.StartWork)) {
						return self.createErrorObject('cloud.common.Error_EndDateTooEarlier', {}, true);
					} else {
						service.removeError(entity);
					}
				}
				return true;
			};

			service.validateScurveFk = function (entity, value, model) {
				return platformDataValidationService.isMandatory(value, model);
			};

			service.validateTotalCost = function (entity, value) {
				if (value > 0 || value < 0) {
					return true;
				}
				return {apply: false, valid: false, error: 'required and cannot be zero'};
			};

			return service;
		}
	]);
})(angular);