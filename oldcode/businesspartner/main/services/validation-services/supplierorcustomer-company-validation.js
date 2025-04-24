/**
 * Created by clv on 8/24/2017.
 */
(function (angular) {

	'use strict';

	var moduleName = 'businesspartner.main';
	angular.module(moduleName).factory('businessPartnerMainSupplierOrCustomerCompanyValidationService', businessPartnerMainSupplierOrCustomerCompanyValidationService);

	businessPartnerMainSupplierOrCustomerCompanyValidationService.$inject = ['_', '$http', '$translate', 'globals', 'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService',
		'platformDataValidationService', 'businesspartnerMainSupplierDataService', 'businesspartnerMainCustomerDataService'];

	function businessPartnerMainSupplierOrCustomerCompanyValidationService(_, $http, $translate, globals, platformRuntimeDataService, basicsLookupdataLookupDescriptorService,
		platformDataValidationService, supplierDataService, customerDataService) {

		let serviceCache = {};

		return function (dataService) {
			let serviceName = null;
			if (dataService && dataService.getServiceName) {
				serviceName = dataService.getServiceName();
				if (serviceName && Object.prototype.hasOwnProperty.call(serviceCache,serviceName)) {
					return serviceCache[serviceName];
				}
			}

			var service = {};

			function getDefaultFromDB(url, entity, model, lookupType) {
				$http.get(globals.webApiBaseUrl + url).then(function (item) {

					if (item && item.data) {
						entity[model] = item.data.Id;
						var data = {};
						data[lookupType] = [item.data];
						basicsLookupdataLookupDescriptorService.attachData(data);
						dataService.gridRefresh();
					}
				});
			}

			function getDefaultFromCache(company, model, lookupType) {
				var filter = {};
				filter[model] = company.SubledgerContextFk;
				filter.IsDefault = true;
				return _.find(basicsLookupdataLookupDescriptorService.getData(lookupType), filter);
			}

			function requiredValidator(value, model) {
				var result = {apply: true, valid: true};
				if (angular.isUndefined(value) || value === null || value === 0) {
					result.valid = false;
					result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
				}
				return result;
			}

			function selectedCompanyInvalid(entity, value, model) {
				var result = {apply: true, valid: false};
				result.error = $translate.instant('businesspartner.main.selectedCompanyInvalid', {fieldName: model});
				platformRuntimeDataService.applyValidationResult(result, entity, model);
				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				return result;
			}

			service.validateBasCompanyFk = function validateBasCompanyFk(entity, value, model) {
				var result = requiredValidator(value, model);
				if (!result.valid) {
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				}
				result = platformDataValidationService.validateIsUnique(entity, value, model, dataService.getList(), service, dataService);
				if (!result.valid) {
					result.error$tr$param$ = {object: $translate.instant('cloud.common.entityCompany')};
					return result;
				}
				var companies = basicsLookupdataLookupDescriptorService.getData('company');
				var company = companies[value];
				var businessPostingGroup = getDefaultFromCache(company, 'BpdSubledgerContextFk', 'BusinessPostingGroup');
				entity.BusinessPostingGroupFk = null;

				if (angular.isDefined(businessPostingGroup) && businessPostingGroup !== null) {
					entity.BusinessPostingGroupFk = businessPostingGroup.Id;
				} else {

					var BusinessPostingGroupurl = 'businesspartner/main/businesspostinggroup/getdefaultbycompanyfk?companyFk=' + value;
					getDefaultFromDB(BusinessPostingGroupurl, entity, 'BusinessPostingGroupFk', 'BusinessPostingGroup');
				}
				if (dataService.name === 'businesspartner.suppliercompany') {
					entity.SupplierLedgerGroupFk = null;
					if (company.SubledgerContextFk !== supplierDataService.getSelected().SubledgerContextFk) {
						return selectedCompanyInvalid(entity, value, model);
					}
					var supplierLedgerGroup = getDefaultFromCache(company, 'SubLedgerContextFk', 'SupplierLedgerGroup');
					if (angular.isDefined(supplierLedgerGroup) && supplierLedgerGroup !== null) {
						entity.SupplierLedgerGroupFk = supplierLedgerGroup.Id;

					} else {
						var supplierledgergroupUrl = 'businesspartner/main/supplierledgergroup/getdefaultbycompanyfk?companyFk=' + value;
						getDefaultFromDB(supplierledgergroupUrl, entity, 'SupplierLedgerGroupFk', 'SupplierLedgerGroup');
					}
				}
				if (dataService.name === 'businesspartner.customercompany') {
					entity.CustomerLedgerGroupFk = null;
					if (company.SubledgerContextFk !== customerDataService.getSelected().SubledgerContextFk) {
						return selectedCompanyInvalid(entity, value, model);
					}
					var customerLedgerGroup = getDefaultFromCache(company, 'SubLedgerContextFk', 'CustomerLedgerGroup');
					if (angular.isDefined(customerLedgerGroup) && customerLedgerGroup !== null) {
						entity.CustomerLedgerGroupFk = customerLedgerGroup.Id;
					} else {
						var CustomerLedgerGroupUrl = 'businesspartner/main/customerledgergroup/getdefaultbycompanyfk?companyFk=' + value;
						getDefaultFromDB(CustomerLedgerGroupUrl, entity, 'CustomerLedgerGroupFk', 'CustomerLedgerGroup');
					}
				}
				platformRuntimeDataService.applyValidationResult(result, entity, model);
				platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				return result;
			};

			return service;
		};
	}
})(angular);