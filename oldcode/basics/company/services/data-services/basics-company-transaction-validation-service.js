/**
 * Created by henkel
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.company';
	/**
	 * @ngdoc service
	 * @name basicsCompanyTransactionValidationService
	 * @description provides validation methods for entities
	 */
	angular.module(moduleName).service('basicsCompanyTransactionValidationService', BasicsCompanyTransactionValidationService);

	BasicsCompanyTransactionValidationService.$inject = ['basicsCompanyTransactionService', 'platformDataValidationService'];

	function BasicsCompanyTransactionValidationService(basicsCompanyTransactionService, platformDataValidationService) {

		var self = this;

		self.validateDocumentType = function (entity, value, model) {
			var items = basicsCompanyTransactionService.getList();
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, self, basicsCompanyTransactionService);
		};

		self.validateCurrency = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCompanyTransactionService);
		};

		self.validateVoucherNumber = function (entity, value,model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCompanyTransactionService);
		};
	}

})(angular);