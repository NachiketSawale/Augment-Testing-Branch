/**
 * Created by jhe on 11/21/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.accountingjournals';

	angular.module(moduleName).service('basicsAccountingJournalsTransactionValidationService', BasicsAccountingJournalsTransactionValidationService);

	BasicsAccountingJournalsTransactionValidationService.$inject = ['basicsAccountingJournalsTransactionService', 'platformDataValidationService', 'platformRuntimeDataService', '$translate'];

	function BasicsAccountingJournalsTransactionValidationService(basicsAccountingJournalsTransactionService, platformDataValidationService, platformRuntimeDataService, $translate) {

		var self = this;

		self.validateDocumentType = function (entity, value, model) {
			var items = basicsAccountingJournalsTransactionService.getList();
			var result = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, self, basicsAccountingJournalsTransactionService);
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, value, model, self, basicsAccountingJournalsTransactionService);
			return result;
		};

		self.validateCurrency = function (entity, value, model) {
			var result = platformDataValidationService.validateMandatory(entity, value, model, self, basicsAccountingJournalsTransactionService);
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, value, model, self, basicsAccountingJournalsTransactionService);
			return result;
		};

		self.validateVoucherNumber = function (entity, value, model) {
			var result = platformDataValidationService.validateMandatory(entity, value, model, self, basicsAccountingJournalsTransactionService);
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, value, model, self, basicsAccountingJournalsTransactionService);
			return result;
		};

		self.validatePostingDate = function (entity, value, model) {
			var result = platformDataValidationService.isMandatory(value, model, {
				fieldName: $translate.instant('basics.accountingJournals.entityPostingDate')
			});
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, value, model, self, basicsAccountingJournalsTransactionService);
			return result;
		};
	}

})(angular);