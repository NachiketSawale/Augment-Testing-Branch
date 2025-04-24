(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name procurementCommonHeaderTextValidationService
	 * @require $http
	 * @description provides validation methods for a PrcHeaderText
	 */
	angular.module('businesspartner.main').factory('businessPartnerMainBusinessPartner2CompanyValidationService',
		['_', '$q', '$translate', '$injector', 'platformDataValidationService', 'basicsLookupdataLookupDataService', 'basicsLookupdataLookupDescriptorService',
			/* jshint -W072 */
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

				service.asyncValidateCompanyFk = function asyncValidateCompanyFk(entity, value, model) {
					let defer = $q.defer();
					let result = requireValidator(value, model);
					if (!result.valid) {
						defer.resolve(result);
						return defer.promise;
					}

					let dataService = $injector.get('businessPartnerMainBP2CompanyDataService');
					let dataListToCheck = angular.copy(dataService.getList());

					if (!_.find(dataListToCheck, {Id: entity.Id})) {
						dataListToCheck.push(entity);
					}

					if (dataListToCheck.length > 0) {
						result = platformDataValidationService.isUnique(dataListToCheck, 'CompanyFk', value, entity.Id);
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
							entity.CompanyResponsibleFk = company.Id;
							entity.BasClerkFk = company.ClerkFk; // default value from company.
						}

						defer.resolve(result);
					} else {
						basicsLookupdataLookupDataService.getItemByKey('company', value).then(function (data) {
							if (!data || !entity || model !== 'CompanyFk') {
								defer.resolve(result);
								return;
							}
							basicsLookupdataLookupDescriptorService.updateData('company', [data]);
							result = companyTypeValidator(data.CompanyTypeFk);
							if (result.valid) {
								entity.CompanyResponsibleFk = data.Id;
								entity.BasClerkFk = data.ClerkFk; // default value from company.
							}

							defer.resolve(result);
						});
					}

					return defer.promise;
				};

				return service;
			}
		]);
})(angular);
