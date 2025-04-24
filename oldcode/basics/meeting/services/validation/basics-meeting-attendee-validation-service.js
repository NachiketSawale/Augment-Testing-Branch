/**
 * Created by chd on 12/16/2021.
 */
(function (angular) {
	/* global _ */
	'use strict';
	let moduleName = 'basics.meeting';

	angular.module(moduleName).factory('basicsMeetingAttendeeValidationService', ['$http', 'platformRuntimeDataService', 'platformDataValidationService', 'businessPartnerLogicalValidator', '$injector', 'basicsLookupdataLookupDescriptorService',
		function ($http, platformRuntimeDataService, platformDataValidationService, businessPartnerLogicalValidator, $injector, lookupDescriptorService) {

			return function (dataService) {
				let service = {};
				let businessPartnerValidatorService = businessPartnerLogicalValidator.getService({dataService: dataService});
				service.validateSubsidiaryFk = businessPartnerValidatorService.subsidiaryValidator;

				service.validateClerkFk = function (entity, newValue, model) {
					if (!_.isNil(newValue)){
						entity.BusinessPartnerFk = null;
						entity.SubsidiaryFk = null;
						entity.ContactFk = null;
						platformRuntimeDataService.readonly(entity, [{field: 'BusinessPartnerFk', readonly: true},
							{field: 'SubsidiaryFk', readonly: true}, {field: 'ContactFk', readonly: true}]);

						let clerk = lookupDescriptorService.getLookupItem('Clerk', newValue);
						setAdditionalColValue(entity, clerk);
					}

					if (_.isNil(newValue)){
						setAdditionalColValueNull(entity);
						platformRuntimeDataService.readonly(entity, [{field: 'BusinessPartnerFk', readonly: false},
							{field: 'SubsidiaryFk', readonly: false}, {field: 'ContactFk', readonly: false}]);
					}

					let result = {apply: true, valid: true};
					platformDataValidationService.finishValidation(result, entity, newValue, model, service, dataService);
				};

				service.validateBusinessPartnerFk = function (entity, value, model) {
					if (_.isNil(value)) {
						entity.SubsidiaryFk = null;
						entity.ContactFk = null;
						setAdditionalColValueNull(entity);
						platformRuntimeDataService.readonly(entity, [{field: 'ClerkFk', readonly: false}]);
					}

					if (!_.isNil(value) && entity.BusinessPartnerFk !== value){
						entity.ClerkFk = null;
						entity.SubsidiaryFk = null;
						entity.ContactFk = null;
						platformRuntimeDataService.readonly(entity, [{field: 'SubsidiaryFk', readonly: false}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ContactFk', readonly: false}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ClerkFk', readonly: true}]);

						$injector.get('basicsLookupdataLookupDataService').getList('Subsidiary').then(function (data) {
							let mainSubsidiary = _.find(data, {IsMainAddress: true, BusinessPartnerFk: value});
							entity.SubsidiaryFk = mainSubsidiary ? mainSubsidiary.Id : null;
							dataService.fireItemModified(entity);
						});

						businessPartnerValidatorService.setDefaultContact(entity, value, 'ContactFk').then(function () {
							lookupDescriptorService.loadItemByKey('Contact', entity.ContactFk).then(function (contact) {
								if (contact) {
									setAdditionalColValue(entity, contact);
									dataService.fireItemModified(entity);
								}
							});
						});
					}

					let result = {apply: true, valid: true};
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				};

				service.validateContactFk = function (entity, value, model) {
					if (_.isNil(value)) {
						entity.BusinessPartnerFk = null;
						entity.SubsidiaryFk = null;
						setAdditionalColValueNull(entity);
						platformRuntimeDataService.readonly(entity, [{field: 'ClerkFk', readonly: false}]);
					}

					if (!_.isNil(value) && entity.ContactFk !== value){
						entity.ClerkFk = null;
						let contact = lookupDescriptorService.getLookupItem('Contact', value);
						setAdditionalColValue(entity, contact);
						platformRuntimeDataService.readonly(entity, [{field: 'BusinessPartnerFk', readonly: false}]);
						platformRuntimeDataService.readonly(entity, [{field: 'SubsidiaryFk', readonly: false}]);
						platformRuntimeDataService.readonly(entity, [{field: 'ClerkFk', readonly: true}]);

						if (entity.BusinessPartnerFk === null) {
							$injector.get('basicsLookupdataLookupDataService').getList('Contact').then(function (data) {
								let contact = _.find(data, {Id: value});
								entity.BusinessPartnerFk = contact ? contact.BusinessPartnerFk : null;
								$injector.get('basicsLookupdataLookupDataService').getList('Subsidiary').then(function (data) {
									let mainSubsidiary = _.find(data, {IsMainAddress: true, BusinessPartnerFk: entity.BusinessPartnerFk});
									entity.SubsidiaryFk = mainSubsidiary ? mainSubsidiary.Id : null;
									dataService.fireItemModified(entity);
								});
								dataService.fireItemModified(entity);
							});
						}
					}

					let result = {apply: true, valid: true};
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				};

				function setAdditionalColValue(entity, value) {
					if (entity && value) {
						entity.Title = value.Title;
						entity.FirstName = value.FirstName;
						entity.FamilyName = value.FamilyName;
						entity.Department = value.Department;
						entity.Email = value.Email;
						entity.TelephoneNumberFk = value.TelephoneNumberFk;
						entity.TelephoneMobilFk = value.TelephoneMobilFk;
						entity.Role = value.Role;
					}
				}

				function setAdditionalColValueNull(entity) {
					if (entity) {
						entity.Title = null;
						entity.FirstName = null;
						entity.FamilyName = null;
						entity.Department = null;
						entity.Email = null;
						entity.TelephoneNumberFk = null;
						entity.TelephoneMobilFk = null;
						entity.Role = null;
					}
				}

				return service;
			};
		}
	]);
})(angular);
