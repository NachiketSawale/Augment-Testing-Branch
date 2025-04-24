(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection

	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).factory('basicsProcurementStructure2ClerkValidationService',
		['validationService', 'platformDataValidationService', 'basicsProcurement2ClerkService',
			'platformRuntimeDataService','basicsCustomClerkRoleLookupDataService','$translate',
			function (validationService, platformDataValidationService, dataService, platformRuntimeDataService,basicsCustomClerkRoleLookupDataService,$translate) {
				var service = validationService.create('structure2Clerk', 'basics/procurementstructure/clerk/schema');
				var self = this;

				self.handleError = function (result, entity) {
					if (!result.valid) {
						platformRuntimeDataService.applyValidationResult(result, entity, 'ClerkRoleFk');
						platformRuntimeDataService.applyValidationResult(result, entity, 'CompanyFk');
						platformRuntimeDataService.applyValidationResult(result, entity, 'ClerkFk');
					} else {
						service.removeError(entity);
					}
				};

				var validateUnique = function (id, company, clerkRole, clerk) {
					return platformDataValidationService.isGroupUnique(
						dataService.getList(),
						{
							CompanyFk: company,
							ClerkRoleFk: clerkRole,
							ClerkFk: clerk
						},
						id,
						'basics.procurementstructure.threeFiledUniqueValueErrorMessage',
						{field1: 'Company', field2: 'Clerk Role', field3: 'Clerk'}
					);
				};

				service.validateCompanyFk = function (entity, value, model) {
					var result = platformDataValidationService.isMandatory(value, model);
					if (result.valid) {
						result = validateUnique(entity.Id, value, entity.ClerkRoleFk, entity.ClerkFk);
					}
					self.handleError(result, entity);
					return result;
				};

				service.validateClerkRoleFk = function (entity, value, model) {
					var isSuccess = true, result = null;
					if (value) {
						var role = basicsCustomClerkRoleLookupDataService.getItemById(value, {lookupType: 'basicsCustomClerkRoleLookupDataService'});
						if (role && role.Isunique) {
							var clerks = dataService.getList();
							var sameRoleClerks = _.filter(clerks, function (item) {
								return item.ClerkRoleFk === value;
							});
							if (sameRoleClerks && sameRoleClerks.length > 0) {
								isSuccess = false;
							}
						}
						if (!isSuccess) {
							result = {
								apply: true,
								valid: false,
								error: '...',
								error$tr$: 'basics.common.clerkRoleMustBeUnique'
							};
						}
					} else {
						isSuccess = false;
						result = {
							apply: true,
							valid: false,
							error: '...',
							error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
							error$tr$param$: {
								fieldName: $translate.instant('basics.common.entityClerkRole')
							}
						};
					}
					platformRuntimeDataService.applyValidationResult(isSuccess ? true : result, entity, model);
					return platformDataValidationService.finishValidation((isSuccess ? true : result), entity, value, model, self, dataService);
				};


				service.validateClerkFk = function (entity, value, model) {
					var result = platformDataValidationService.isMandatory(value, model);
					if (result.valid) {
						result = validateUnique(entity.Id, entity.CompanyFk, entity.ClerkRoleFk, value);
					}
					self.handleError(result, entity);
					return result;
				};

				function onEntityCreated(e, entity) {
					var result = platformDataValidationService.isMandatory(entity.ClerkFk, 'ClerkFk');
					platformRuntimeDataService.applyValidationResult(result, entity, 'ClerkFk');
					dataService.gridRefresh();
				}

				dataService.registerEntityCreated(onEntityCreated);

				return service;
			}
		]);
})(angular);
