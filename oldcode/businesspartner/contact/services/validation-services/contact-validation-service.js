(function (angular) {
	'use strict';
	let module = 'businesspartner.contact';

	/**
	 * @ngdoc service
	 * @name businessPartnerContactValidationService
	 * @function
	 * @requireds $translate,$timeout, basicsLookupdataLookupDescriptorService, basicsCommonUtilities
	 * @description
	 *
	 * Validation service for businesspartner contact 'contact' grid/form controller
	 */
	angular.module(module).factory('businessPartnerContactValidationService', [
		'_', '$injector', '$translate', '$timeout', 'basicsLookupdataLookupDescriptorService', 'basicsCommonUtilities',
		function (_, $injector, $translate, $timeout, basicsLookupdataLookupDescriptorService, basicsCommonUtilities) {
			function requiredValidator(value, model) {
				let result = {apply: true, valid: true};
				if (angular.isUndefined(value) || value === null || value === -1 || value === 0) {
					result.valid = false;
					result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
				}

				return result;
			}

			return function (dataService) {
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

				function setSubsidiaryByBusinessPartner(curItem, businessPartnerId) {
					// subsidiary: set main address of current bp
					return $injector.get('basicsLookupdataLookupDataService').getList('Subsidiary').then(function (data) {
						let mainSubsidiary = _.find(data, {IsMainAddress: true, BusinessPartnerFk: businessPartnerId});
						curItem.SubsidiaryFk = mainSubsidiary ? mainSubsidiary.Id : null;
						let bpAssignmentDataService = $injector.get('businesspartnerContact2BpAssignmentDataService');
						let bpAssignments = bpAssignmentDataService.getList();
						if(bpAssignments && bpAssignments.length > 0){
							let bpAssignment = _.find(bpAssignments, {IsMain: true});
							bpAssignment['BusinessPartnerFk'] = businessPartnerId;
							bpAssignment['SubsidiaryFk'] = mainSubsidiary.Id;
							bpAssignmentDataService.gridRefresh();
							bpAssignmentDataService.markItemAsModified(bpAssignment);
						}
						return {apply: true, valid: true};
					});
				}

				service.validateCompanyFk = function validateCompanyFk(entity, value, model) {
					return requiredValidator(value, model);
				};

				service.asyncValidateBusinessPartnerFk = function validateBusinessPartnerFk(entity, value) {
					return setSubsidiaryByBusinessPartner(entity, value);
				};

				service.validateSubsidiaryFk = function validateSubsidiaryFk(entity, value) {
					if (entity) {
						let subsidiaries = basicsLookupdataLookupDescriptorService.getData('Subsidiary') || {};
						entity.SubsidiaryDescriptor = subsidiaries[value];

						let args = {
							field: 'SubsidiaryFk',
							value: value
						};
						dataService.subsidiaryChanged.fire(args);
					}
					return {apply: true, valid: true};
				};

				service.validateContactRoleFk = function validateContactRoleFk(entity, value) {
					if (entity && entity.ContactRoleFk !== value) {
						entity.ContactRoleFk = value;

						let args = {
							field: 'ContactRoleFk',
							value: value
						};
						dataService.contactRoleChanged.fire(args);
					}
					return {apply: true, valid: true};
				};

				service.validateIsDefault = function validateIsDefault(entity, value) {

					// entity.IsDefault = value;
					// dataService.markItemAsModified(entity);
					if (value === true || value === 1) {
						let allContacts = dataService.getList();
						if (allContacts) {

							let foundItem = _.find(allContacts, function (item) {
								if (item.Id !== entity.Id && item.BusinessPartnerFk === entity.BusinessPartnerFk && item.IsDefault) {
									return item;
								}
							});
							if (foundItem) {
								foundItem.IsDefault = false;
								// dataService.markItemAsModified(foundItem);
								dataService.fireItemModified(foundItem);
								// dataService.gridRefresh();
							}
						}
					}
				};
				service.validateTelephoneNumberDescriptor = validateTelephone;
				service.validateTelephoneNumber2Descriptor = validateTelephone;
				service.validateTeleFaxDescriptor = validateTelephone;
				service.validateMobileDescriptor = validateTelephone;
				service.validatePrivateTelephoneNumberDescriptor = validateTelephone;
				service.validateAddressDescriptor = gridRefresh;

				return service;
			};
		}
	]);
})(angular);
