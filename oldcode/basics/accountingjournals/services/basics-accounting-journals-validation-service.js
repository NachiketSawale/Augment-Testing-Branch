/**
 * Created by jhe on 11/22/2018.
 */
(function (angular) {

	'use strict';
	/* global angular, moment */

	var moduleName = 'basics.accountingjournals';

	angular.module(moduleName).service('basicsAccountingJournalsValidationService', basicsAccountingJournalsValidationService);

	basicsAccountingJournalsValidationService.$inject = ['basicsAccountingJournalsMainService', 'platformDataValidationService', 'basicsLookupdataLookupDataService', 'platformRuntimeDataService',
		'$translate', 'platformPermissionService', 'permissions', 'basicsAccountingJournalsTransactionService'];

	function basicsAccountingJournalsValidationService(dataService, platformDataValidationService, lookupDataService, platformRuntimeDataService,
		$translate, platformPermissionService, permissions, basicsAccountingJournalsTransactionService) {
		var self = this;

		self.validateCompanyYearFk = function validateCompanyYearFk(entity, value, model) {
			var result;
			if (value) {
				entity.CompanyYearFk = value;
				entity.CompanyPeriodFk = 0;
				entity.TradingPeriodStartDate = null;
				entity.TradingPeriodEndDate = null;
				result = {
					apply: true,
					error: $translate.instant('basics.accountingJournals.tradingPeriodIsEmpty'),
					valid: false
				};
				platformRuntimeDataService.applyValidationResult(result, entity, 'CompanyPeriodFk');
				platformDataValidationService.finishValidation(result, entity, null, 'CompanyPeriodFk', self, dataService);
				// return result;
			} else {
				value = null;
			}
			result = platformDataValidationService.isMandatory(value, model, {
				fieldName: $translate.instant('basics.accountingJournals.entityTradingYear')
			});
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, value, model, self, dataService);
			return result;
		};

		self.validateCompanyPeriodFk = function validateCompanyPeriodFk(entity, value, model) {
			if (value) {
				lookupDataService.getItemByKey('companyperiod', value).then(function (data) {
					if (angular.isObject(data)) {
						entity.TradingPeriodStartDate = moment.utc(data.StartDate).format('L');
						entity.TradingPeriodEndDate = moment.utc(data.EndDate).format('L');
						dataService.fireItemModified(entity);
						dataService.gridRefresh();
					}
				}
				);
			} else {
				value = null;
			}
			var result = platformDataValidationService.isMandatory(value, model, {
				fieldName: $translate.instant('basics.accountingJournals.entityTradingPeriod')
			});
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, value, model, self, dataService);
			return result;
		};

		self.validateTransactionTypeFk = function validateTransactionTypeFk(entity, value, model) {
			if (value) {
				lookupDataService.getItemByKey('TransactionType', value).then(function (data) {
					if (angular.isObject(data)) {
						entity.TransactionTypeDescription = data.Description;
						entity.TransactionTypeAbbreviation = data.Abbreviation;
						dataService.fireItemModified(entity);
						dataService.gridRefresh();
					}
				}
				);
			} else {
				value = null;
			}
			var result = platformDataValidationService.isMandatory(value, model, {
				fieldName: $translate.instant('basics.accountingJournals.entityTransactionTypeDescription')
			});
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, value, model, self, dataService);
			return result;
		};

		self.validatePostingDate = function (entity, value, model) {
			var result = platformDataValidationService.isMandatory(value, model, {
				fieldName: $translate.instant('basics.accountingJournals.entityPostingDate')
			});
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, value, model, self, dataService);
			return result;
		};

		self.validateIsSuccess = function validateIsSuccess(entity, value, model) {
			if (value === true) {
				platformPermissionService.restrict(basicsAccountingJournalsTransactionService.getContainerUUID().toLowerCase(), permissions.read);
			} else {
				platformPermissionService.restrict(basicsAccountingJournalsTransactionService.getContainerUUID().toLowerCase(), false);
			}

			return platformDataValidationService.validateMandatory(entity, value, model, self, dataService);
		};

	}

})(angular);