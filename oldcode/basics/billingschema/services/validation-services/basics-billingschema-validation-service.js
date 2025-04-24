/**
 * Created by chm on 6/3/2015.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsBillingSchemaValidationService
	 * @description provides validation methods for billing schema instances
	 */
	angular.module('basics.billingschema').factory('basicsBillingSchemaValidationService', ['basicsBillingSchemaService', 'platformPropertyChangedUtil', 'platformDataValidationService',
		function (dataService, platformPropertyChangedUtil, platformDataValidationService) {
			var self = this;

			return {
				validateModel: function () {

				},
				validateIsDefault: function (currentItem, value, field) {
					platformPropertyChangedUtil.onlyOneIsTrue(dataService, currentItem, value, field);
					return {apply: value, valid: true};
				},
				validateValidFrom: function (entity, value, model) {
					return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, self, dataService, 'ValidTo');
				},
				validateValidTo: function (entity, value, model) {
					return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, self, dataService, 'ValidFrom');
				}
			};
		}
	]);
})(angular);