/**
 * Created by henkel on 15.09.2014.
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCompanyValidationService
	 * @description provides validation methods for company instances
	 */
	angular.module('basics.company').service('basicsCompanyValidationService', BasicsCompanyValidationService);

	BasicsCompanyValidationService.$inject = ['$http', 'globals', '$q', '$translate', 'basicsCompanyMainService', 'platformDataValidationService', 'basicsLookupdataSimpleLookupService', 'platformRuntimeDataService'];

	function BasicsCompanyValidationService($http, globals, $q, $translate, basicsCompanyMainService, platformDataValidationService, basicsLookupdataSimpleLookupService, platformRuntimeDataService) {
		var self = this;

		self.asyncValidateLedgerContextFk = function asyncValidateLedgerContextFk(entity, value, model) {
			return self.doAysncValidation({company: entity, newintvalue: value, model: model}).then(function (result) {
				if (result.dataItem) {
					entity.BillingSchemaFk = result.dataItem.BillingSchemaFk;
					entity.TaxCodeFk = result.dataItem.TaxCodeFk;
				}
				delete result.dataItem;

				return result;
			});
		};

		self.asyncValidateSchedulingContextFk = function asyncValidateSchedulingContextFk(entity, value, model) {
			return self.doAysncValidation({company: entity, newintvalue: value, model: model}).then(function (result) {
				if (result.dataItem) {
					entity.CalendarFk = result.dataItem.CalendarFk;
				}
				delete result.dataItem;

				return result;
			}, function () {
				//handle error here
				entity.CalendarFk = null;

				return self.validateCalendarFk(entity, null, 'CalendarFk');
			});
		};

		self.asyncValidateContextFk = function asyncValidateContextFk(entity, value, model) {
			return self.doAysncValidation({company: entity, newintvalue: value, model: model}).then(function (result) {
				if (result.dataItem) {
					entity.LineItemContextFk = result.dataItem.LineItemContextFk;
				}
				delete result.dataItem;

				return result;
			}, function () {
				//handle error here
				entity.LineItemContextFk = null;

				return self.validateLineItemContextFk(entity, null, 'LineItemContextFk');
			});
		};

		self.doAysncValidation = function doAysncValidation(valData) {
			var asyncMarker = platformDataValidationService.registerAsyncCall(valData.company, valData.value, valData.model, basicsCompanyMainService);

			var originalEntity = valData.company;

			return $http.post(globals.webApiBaseUrl + 'basics/company/validate', valData
			).then(function (response) {

				basicsCompanyMainService.fireItemModified(originalEntity);

				var result = platformDataValidationService.finishAsyncValidation({
					valid: true,
					apply: true,
				}, valData.company, valData.value, valData.model, asyncMarker, self, basicsCompanyMainService);
				result.dataItem = response.data.Company;

				return result;
			}, function () {
				//handle error here
				var result = platformDataValidationService.finishAsyncValidation({
					valid: false,
					apply: false,
					error: $translate.instant('basics.company.errorHasNoDefaultValue')
				}, valData.company, valData.value, valData.model, asyncMarker, self, basicsCompanyMainService);
				result.dataItem = null;

				return result;
			});
		};

		self.validateCode = function (entity, value, model) {
			var items = basicsCompanyMainService.getList();
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, self, basicsCompanyMainService);
		};

		self.validateInternet = function (entity, value, model) {
			return platformDataValidationService.validateUrl(entity, value, model, self, basicsCompanyMainService);
		};

		self.validateContextFk = function validateContextFk(entity, value) {
			entity.LineItemContextFk = null;

			return !_.isNil(value);
		};

		self.validateCountryFk = function validateCountryFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCompanyMainService);
		};

		self.validateCompanyTypeFk = function validateCompanyTypeFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCompanyMainService);
		};

		self.validateLanguageFk = function validateLanguageFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCompanyMainService);
		};

		self.validatePaymentTermFiFk = function validatePaymentTermFiFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCompanyMainService);
		};

		self.validatePaymentTermPaFk = function validatePaymentTermPaFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCompanyMainService);
		};

		self.validateModuleContextFk = function validateModuleContextFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCompanyMainService);
		};

		self.validateLineItemContextFk = function validateLineItemContextFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCompanyMainService);
		};

		self.validateLedgerContextFk = function validateLedgerContextFk(entity, value, model) {
			entity.TaxCodeFk = null;
			entity.BillingSchemaFk = null;

			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCompanyMainService);
		};

		self.validateSubledgerContextFk = function validateSubledgerContextFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCompanyMainService);
		};

		self.validateSchedulingContextFk = function validateSchedulingContextFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCompanyMainService);
		};

		self.validateCalendarFk = function validateCalendarFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCompanyMainService);
		};

		self.validateTextModuleContextFk = function validateTextModuleContextFk(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCompanyMainService);
		};

		self.asyncValidateEquipmentDivisionFk = function validateEquipmentDivisionFk(entity, value) {
			if (entity && value) {
				return basicsLookupdataSimpleLookupService.getItemById(value, {
					lookupModuleQualifier: 'basics.company.etm.division',
					displayMember: 'Description',
					valueMember: 'Id',
					filter: {
						customIntegerProperty: 'BAS_ETM_CONTEXT_FK',
						customIntegerProperty1: 'LGM_CONTEXT_FK',
						customBoolProperty: 'ISDEFAULT'
					}
				}).then(function (EquipmentDivisionItem) {
					var readonly = null;
					if ((EquipmentDivisionItem.BasEtmContextFk && EquipmentDivisionItem.LgmContextFk)) {
						entity.EquipmentContextFk = EquipmentDivisionItem.BasEtmContextFk;
						entity.LogisticContextFk = EquipmentDivisionItem.LgmContextFk;
						readonly = true;
					} else {
						readonly = false;
					}
					platformRuntimeDataService.readonly(entity, [
						{
							field: 'EquipmentContextFk',
							readonly: readonly
						},
						{
							field: 'LogisticContextFk',
							readonly: readonly
						}
					]);
				});
			}
			return $q.when(false);
		};
	}

})(angular);
