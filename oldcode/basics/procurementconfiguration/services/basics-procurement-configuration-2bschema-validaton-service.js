/**
 * Created by wuj on 9/2/2015.
 */
(function (angular) {
	'use strict';
	/* global _ */
	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName).factory('basicsProcurementConfiguration2BSchemaValidationService',
		['platformDataValidationService', 'basicsProcurementConfiguration2BSchemaDataService', 'platformRuntimeDataService',
			function (platformDataValidationService, dataService, platformRuntimeDataService) {
				var service = {};
				var self = this;

				self.removeError = function (entity) {
					if (entity.__rt$data && entity.__rt$data.errors) {
						entity.__rt$data.errors = null;
					}
				};

				self.handleError = function (result, entity) {
					if (!result.valid) {
						platformRuntimeDataService.applyValidationResult(result, entity, 'LedgerContextFk');
						platformRuntimeDataService.applyValidationResult(result, entity, 'BillingSchemaFk');
					} else {
						self.removeError(entity);
					}
				};

				self.validateUnique = function (id, ledgerContextFk, billingSchemaFk) {
					return platformDataValidationService.isGroupUnique(
						dataService.getList(),
						{
							LedgerContextFk: ledgerContextFk,
							BillingSchemaFk: billingSchemaFk
						},
						id,
						'cloud.common.towFiledUniqueValueErrorMessage',
						{field1: 'ledger context', field2: 'billing schema'}
					);
				};

				service.validateLedgerContextFk = function (entity, value, model) {
					var result = platformDataValidationService.isMandatory(value, model);
					if (result.valid) {
						result = self.validateUnique(entity.Id, value, entity.BillingSchemaFk);
					}
					self.handleError(result, entity);
					return result;
				};


				service.validateBillingSchemaFk = function (entity, value, model) {
					var result = platformDataValidationService.isMandatory(value, model);
					if (result.valid) {
						result = self.validateUnique(entity.Id, entity.LedgerContextFk, value);
					}
					self.handleError(result, entity);
					return result;
				};

				service.validateIsDefault = function (entity, value) {
					if (value) {
						var list = dataService.getList();
						_.forEach(list, function (item) {
							if (item.IsDefault) {
								item.IsDefault = false;
								dataService.markItemAsModified(item);
							}
						});
					}
					return true;
				};
				return service;

			}]);
})(angular);