(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.contact';

	angular.module(moduleName).factory('businessPartnerContact2CompanyValidationService',
		['_', '$q', '$translate', '$injector', 'platformDataValidationService', 'basicsLookupdataLookupDataService', 'basicsLookupdataLookupDescriptorService',
			function (_, $q, $translate, $injector, platformDataValidationService, basicsLookupdataLookupDataService, basicsLookupdataLookupDescriptorService) {

				let service = {};

				function requireValidator(value, model) {
					let result = {apply: true, valid: true};
					if (angular.isUndefined(value) || value === null || value === -1) {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
					}
					return result;
				}

				function companyTypeValidator(companyTypeId) {
					let result = {apply: true, valid: true};
					if (companyTypeId === 2) {
						result.valid = false;
						result.error = $translate.instant('cloud.common.companyWithWrongCompanyTypeErrorMessage');
					}
					return result;
				}

				service.asyncValidateBasCompanyFk = function asyncValidateCompanyFk(entity, value, model) {
					let defer = $q.defer();
					let result = requireValidator(value, model);
					if (!result.valid) {
						defer.resolve(result);
						return defer.promise;
					}

					let dataService = $injector.get('businessPartnerContact2CompanyDataService');
					let dataListToCheck = angular.copy(dataService.getList());

					if (!_.find(dataListToCheck, {Id: entity.Id})) {
						dataListToCheck.push(entity);
					}

					if (dataListToCheck.length > 0) {
						result = platformDataValidationService.isUnique(dataListToCheck, 'BasCompanyFk', value, entity.Id);
					}

					if (!result.valid) {
						result.apply = true;
						defer.resolve(result);
						return defer.promise;
					}

					let companies = basicsLookupdataLookupDescriptorService.getData('Company');
					if (companies?.[value]) {
						let company = companies[value];
						result = companyTypeValidator(company.CompanyTypeFk);
						if (result.valid) {
							entity.BasCompanyResponsibleFk = company.Id;
							entity.BasClerkFk = company.ClerkFk; // default value from company.
						}

						defer.resolve(result);
					} else {
						basicsLookupdataLookupDataService.getItemByKey('company', value).then(function (data) {
							if (!data || !entity || model !== 'BasCompanyFk') {
								defer.resolve(result);
								return;
							}
							basicsLookupdataLookupDescriptorService.updateData('company', [data]);
							result = companyTypeValidator(data.CompanyTypeFk);
							if (result.valid) {
								entity.BasCompanyResponsibleFk = data.Id;
								entity.BasClerkFk = data.ClerkFk; // default value from company.
							}

							defer.resolve(result);
						});
					}

					return defer.promise;
				};

				return service;
			}]);
})(angular);