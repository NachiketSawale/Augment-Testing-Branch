(function (angular) {

	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonClerkValidationServiceFactory', ['_', 'platformDataValidationService', 'platformRuntimeDataService', 'basicsCustomClerkRoleLookupDataService', '$translate', 'platformModuleStateService',
		'basicsLookupdataLookupDescriptorService',
		function (_, platformDataValidationService, platformRuntimeDataService, basicsCustomClerkRoleLookupDataService, $translate, platformModuleStateService, basicsLookupdataLookupDescriptorService) {

			const service = {}, instanceCache = {};

			function ValidationService(dataService) {

				const self = this;

				this.validateClerkRoleFk = function validateClerkRoleFk(entity, value, model) {
					let isSuccess = true, result = null;
					if (value) {
						const role = basicsCustomClerkRoleLookupDataService.getItemById(value, {lookupType: 'basicsCustomClerkRoleLookupDataService'});
						if (role && role.Isunique) {
							const clerks = dataService.getList();
							const sameRoleClerks = _.filter(clerks, function (item) {
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
					if(isSuccess){
						triggerLeadingServiceModifyItem();
					}
					platformRuntimeDataService.applyValidationResult(isSuccess ? true : result, entity, model);
					return platformDataValidationService.finishValidation((isSuccess ? true : result), entity, value, model, self, dataService);
				};

				// validators ClerkFk
				this.validateClerkFk = function validateClerkFk(entity, value, model) {
					let result = true;
					if (value === 0 || value === null) {
						const error = $translate.instant('cloud.common.entityClerk');
						result = {
							apply: true,
							valid: false,
							error: '...',
							error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
							error$tr$param$: {fieldName: error}
						};
					}
					if(result === true || result.valid){
						triggerLeadingServiceModifyItem();
					}
					const clerkItems = basicsLookupdataLookupDescriptorService.getData('Clerk')
					const item = _.find(clerkItems, {'Id': value});
					if (item) {
						entity.CompanyFk = item.CompanyFk;
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, self, dataService);
					return result;
				};

				this.validateContextFk = function validateContextFk(entity, value, model) {
					let result = true;
					if (value === null) {
						return result;
					}
					if (value === 0) {
						result = {
							apply: true,
							valid: false,
							error: '...',
							error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
							error$tr$param$: {fieldName: ''}
						};
					}
					if(result === true || result.valid){
						triggerLeadingServiceModifyItem();
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, self, dataService);
					return result;
				};

				// validators ValidFrom
				this.validateValidFrom = function validateValidFrom(entity, value, model) {
					var result = platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, this, dataService, 'ValidTo');
					if(result === true || result.valid){
						triggerLeadingServiceModifyItem();
					}
					return result;
				};

				this.validateValidTo = function validateValidTo(entity, value, model) {
					var result = platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, this, dataService, 'ValidFrom');
					if(result === true || result.valid){
						triggerLeadingServiceModifyItem();
					}
					return result;
				};

				this.validateCommentText = function validateValidTo(entity, value, model) {
					if(entity.CommentText !== value){
						triggerLeadingServiceModifyItem();
					}
					return true;
				};


				// if config the clerk for project document, need to set the project document parent as modifiend, fix issue: #135899
				function triggerLeadingServiceModifyItem() {
					var parentService =  dataService.parentService();
					if(parentService !== null && parentService.getServiceName() === 'documentsProjectDocumentDataService'){
						var leadingService = parentService.parentService();
						if(leadingService !== null){
							//if only change the project document information then not need to save the header
							//when click the save button in header container just trigger to save the document action
							var leadingState = platformModuleStateService.state(leadingService.getModule());
							if(leadingState && leadingState.modifications){
								leadingState.modifications.EntitiesCount += 1;
							}
						}
					}
				}

			}

			service.getService = function (qualifier, dataService) {
				const cacheKey = dataService.getServiceName().toLowerCase();
				if (instanceCache[cacheKey]) {
					return instanceCache[cacheKey];
				} else {
					const instance = new ValidationService(dataService);
					instanceCache[cacheKey] = instance;
					return instance;
				}
			};

			return service;

		}]);

})(angular);