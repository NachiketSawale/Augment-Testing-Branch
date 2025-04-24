/**
 * Created by baf on 05.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.sundrygroup';

	/**
	 * @ngdoc service
	 * @name logisticSundryServiceGroupAccountValidationService
	 * @description provides validation methods for logistic sundryServiceGroup account entities
	 */
	angular.module(moduleName).service('logisticSundryServiceGroupAccountValidationService', LogisticSundryServiceGroupAccountValidationService);

	LogisticSundryServiceGroupAccountValidationService.$inject = ['platformValidationServiceFactory', 'logisticSundryServiceGroupConstantValues', 'logisticSundryServiceGroupAccountDataService'];

	function LogisticSundryServiceGroupAccountValidationService(platformValidationServiceFactory, logisticSundryServiceGroupConstantValues, logisticSundryServiceGroupAccountDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticSundryServiceGroupConstantValues.schemes.account, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticSundryServiceGroupConstantValues.schemes.account)
		},
		self,
		logisticSundryServiceGroupAccountDataService);

		self.validateAdditionalLedgerContextFk = function validateAdditionalLedgerContextFk(entity, value /* , model */) {

			if (entity.LedgerContextFk !== value) {
				entity.Account01Fk = null;
				entity.Account02Fk = null;
				entity.Account03Fk = null;
				entity.Account04Fk = null;
				entity.Account05Fk = null;
				entity.Account06Fk = null;
			}
		};
	}
})(angular);
