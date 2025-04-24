(function (angular) {
	'use strict';
	angular.module('businesspartner.evaluationschema').factory('businessPartnerEvaluationschemaGroupValidationService',
		['$timeout', 'platformPropertyChangedUtil', 'platformDataValidationService',
			function ($timeout, platformPropertyChangedUtil, platformDataValidationService) {

				return function (dataService) {
					return {
						validateModel: function () {

						},
						validateIsDefault: function (entity, value, model) {
							platformPropertyChangedUtil.onlyOneIsTrue(dataService, entity, value, model);
							return { apply: value, valid: true };
						},
						validateWeighting: function (entity, value, model) {
							let result = platformDataValidationService.isAmong(entity, value, model, 0, 100);
							return platformDataValidationService.finishValidation(result, entity, value, model, this, dataService);
						}
					};
				};
			}
		]);
})(angular);