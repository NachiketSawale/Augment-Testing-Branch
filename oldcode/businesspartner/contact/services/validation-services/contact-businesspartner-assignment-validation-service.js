(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	let moduleName = 'businesspartner.contact';

	angular.module(moduleName).factory('businessPartnerContact2BpAssignmentValidationService',
		['platformDataValidationService', 'businesspartnerContact2BpAssignmentDataService', 'platformRuntimeDataService', 'businesspartnerContactDataService',
			function (platformDataValidationService, dataService, platformRuntimeDataService, businesspartnerContactDataService) {

				let service = {};

				service.validateBusinessPartnerFk = function validateBusinessPartnerFk(entity, value, model) {
					let items = dataService.getList();
					let result = platformDataValidationService.isUnique(items, model, value, entity.Id, false);
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				};

				service.validateSubsidiaryFk = function validateSubsidiaryFk(entity, value) {
					if (entity && entity.SubsidiaryFk !== value) {
						entity.SubsidiaryFk = value;

						let args = {
							field: 'SubsidiaryFk',
							value: value,
							isMain: entity.IsMain
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
							value: value,
							isMain: entity.IsMain
						};
						dataService.contactRoleChanged.fire(args);
					}
					return {apply: true, valid: true};
				};

				service.validateIsMain = function validateIsMain(entity, value, model) {
					updateIsMain(entity, value, model);
					return {apply: value, valid: true};
				};

				function updateIsMain(entity, value, model) {
					dataService.markItemAsModified(entity);
					_.forEach(dataService.getList(), function (item) {
						if (item !== entity && item[model]) {
							item[model] = false;
							dataService.markItemAsModified(item);
							dataService.gridRefresh();
						}
					});

					if (value) {
						let contact = businesspartnerContactDataService.getSelected();
						contact.ContactRoleFk = entity.ContactRoleFk;
						contact.SubsidiaryFk = entity.SubsidiaryFk;
						contact.BusinessPartnerFk = entity.BusinessPartnerFk;
						businesspartnerContactDataService.markCurrentItemAsModified();
						businesspartnerContactDataService.gridRefresh();
					}
				}

				return service;
			}]);
})(angular);