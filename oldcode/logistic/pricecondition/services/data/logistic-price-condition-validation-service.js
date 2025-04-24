/**
 * Created by baf on 28.02.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc service
	 * @name logisticPriceConditionValidationService
	 * @description provides validation methods for logistic price condition entities
	 */
	angular.module(moduleName).service('logisticPriceConditionValidationService', LogisticPriceConditionValidationService);

	LogisticPriceConditionValidationService.$inject = ['_', 'platformValidationServiceFactory', 'platformDataValidationService', 'logisticPriceConditionConstantValues',
		'logisticPriceConditionDataService'];

	function LogisticPriceConditionValidationService(_, platformValidationServiceFactory, platformDataValidationService, logisticPriceConditionConstantValues,
		logisticPriceConditionDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticPriceConditionConstantValues.schemes.priceCondition,
			{
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticPriceConditionConstantValues.schemes.priceCondition)
			},
			self,
			logisticPriceConditionDataService);

		self.asyncValidateCode = function asyncValidateCode(entity, value, model) {
			return platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'logistic/pricecondition/isunique', entity, value, model).then(function (response) {
				if (!entity[model] && angular.isObject(response)) {
					response.apply = true;
				}
				return platformDataValidationService.finishAsyncValidation(response, entity, value, model, null, self, logisticPriceConditionDataService);
			});
		};

		self.validateIsDefault = function validateIsDefault(entity, value) {
			if (value) {
				_.filter(logisticPriceConditionDataService.getList(), 'IsDefault', true)
					.forEach(function (item) {
						item.IsDefault = false;
					});
				logisticPriceConditionDataService.markItemAsModified(entity);
				logisticPriceConditionDataService.gridRefresh();
			}
			return {apply: value, valid: true};
		};
	}
})(angular);
