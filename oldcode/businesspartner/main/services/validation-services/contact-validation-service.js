(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	/**
	 * @ngdoc service
	 * @name businesspartner.main.businessPartnerMainContactValidationService
	 * @function
	 * @requireds $translate,$timeout, basicsLookupdataLookupDescriptorService, basicsCommonUtilities
	 *
	 * @description Provide contact validation service
	 */
	angular.module('businesspartner.main').factory('businessPartnerMainContactValidationService',
		['$translate', '$timeout', 'basicsLookupdataLookupDescriptorService', 'basicsCommonUtilities','$http','globals',
			function ($translate, $timeout, basicsLookupdataLookupDescriptorService, basicsCommonUtilities,$http,globals) {

				let serviceCache = {};

				function requiredValidator(value, model) {
					let result = {apply: true, valid: true};
					if (angular.isUndefined(value) || value === null || value === -1 || value === 0) {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
					}

					return result;
				}

				return function (dataService) {

					dataService = dataService || {
						getServiceName: function () {
							return 'Anonym';
						},
						gridRefresh: function () {},
						getList: function () {},
						markItemAsModified: function () {}
					};

					let serviceName = null;
					if (dataService?.getServiceName) {
						serviceName = dataService.getServiceName();
						if (serviceName && Object.hasOwn(serviceCache, serviceName)) {
							return serviceCache[serviceName];
						}
					}

					let service = {};

					let fields = {
						TelephoneNumberDescriptor: 'TelephonePattern',
						TelephoneNumber2Descriptor: 'Telephone2Pattern',
						TeleFaxDescriptor: 'TelefaxPattern',
						MobileDescriptor: 'MobilePattern',
						PrivateTelephoneNumberDescriptor: 'TelephonePrivatPattern'
					};

					function gridRefresh() {
						$timeout(dataService.gridRefresh, 100, false);
					}

					function updatePattern(entity, value, model) {
						if (!entity) {
							return;
						}
						entity[fields[model]] = basicsCommonUtilities.generatePhonePattern(value ? value.Telephone : '');
					}

					function validateTelephone(entity, value, model) {
						updatePattern(entity, value, model);
						gridRefresh();
					}

					service.validateCompanyFk = function validateCompanyFk(entity, value, model) {
						return requiredValidator(value, model);
					};

					service.validateSubsidiaryFk = function validateSubsidiaryFk(entity, value) {
						if (entity){
							if(entity.Version===0) {
								$http.get(globals.webApiBaseUrl + 'businesspartner/main/businesspartner/getphonebysubsidiary?id='+value).then(function (response) {
									if (response.data) {
										entity.TeleFaxDescriptor=response.data.TeleFaxDescriptor;
										entity.TelephoneNumberDescriptor=response.data.TelephoneNumberDescriptor;
										dataService.gridRefresh();
									}
								});
							}
							let subsidiaries = basicsLookupdataLookupDescriptorService.getData('Subsidiary') || {};
							entity.SubsidiaryDescriptor = subsidiaries[value];
						}
						return { apply: true, valid: true };
					};

					service.validateIsDefault = function validateIsDefault(entity, value) {
						if (value === true || value === 1) {
							let allContacts = dataService.getList();

							let foundItem = _.find(allContacts, function (item) {
								if (item.Id !== entity.Id && item.IsDefault) {
									return item;
								}
							});
							if (foundItem) {
								foundItem.IsDefault = false;
								dataService.markItemAsModified(foundItem);
								dataService.gridRefresh();
							}
						}
					};
					service.validateIsDefaultBaseline = function validateIsDefaultBaseline(entity, value) {
						if (value === true || value === 1) {
							const allContacts = dataService.getList();

							const foundItem = _.find(allContacts, function (item) {
								if (item.Id !== entity.Id && item.IsDefaultBaseline) {
									return item;
								}
							});
							if (foundItem) {
								foundItem.IsDefaultBaseline = false;
								dataService.markItemAsModified(foundItem);
								dataService.gridRefresh();
							}
						}
					};
					service.validateTelephoneNumberDescriptor = validateTelephone;
					service.validateTelephoneNumber2Descriptor = validateTelephone;
					service.validateTeleFaxDescriptor = validateTelephone;
					service.validateMobileDescriptor = validateTelephone;
					service.validatePrivateTelephoneNumberDescriptor = validateTelephone;
					service.validateAddressDescriptor = gridRefresh;

					serviceCache[serviceName] = service;
					return service;
				};

			}
		]);
})(angular);
