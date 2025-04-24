(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainTimekeepingClerkValidationService
	 * @description provides validation methods for project main timekeeping2clerk entities
	 */
	angular.module(moduleName).service('projectMainTimekeepingClerkValidationService', ProjectMainTimekeepingClerkValidationService);

	ProjectMainTimekeepingClerkValidationService.$inject = ['_', '$http','globals', 'platformValidationServiceFactory', 'platformRuntimeDataService',
		'platformDataValidationService', 'basicsCustomClerkRoleLookupDataService', 'projectMainConstantValues', 'projectMainTimekeepingClerkDataService'];

	function ProjectMainTimekeepingClerkValidationService(_, $http, globals, platformValidationServiceFactory, platformRuntimeDataService,
		platformDataValidationService, basicsCustomClerkRoleLookupDataService, projectMainConstantValues, projectMainTimekeepingClerkDataService) {
		let self = this;
		platformValidationServiceFactory.addValidationServiceInterface(projectMainConstantValues.schemes.timekeeping2Clerk, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(projectMainConstantValues.schemes.timekeeping2Clerk)
		},
		self,
		projectMainTimekeepingClerkDataService);

		function doValidateClerkAndRole(entity, value, model, compositeModel, compositeValue, message1, message2){
			let res = true;
			if (!value) {
				res = {
					apply: false, valid: false, error: message1
				};
			} else {
				let roleFkValue = model === 'ClerkRoleFk' ? value : compositeValue;
				let cr = basicsCustomClerkRoleLookupDataService.getItemById(roleFkValue, {lookupType: 'basicsCustomClerkRoleLookupDataService'});
				if (cr && cr.IsUnique) {
					let recsWithSameRole = _.filter(projectMainTimekeepingClerkDataService.getList(), function (cl) {
						return cl[model] === value && cl[compositeModel] === compositeValue && cl.JobFk === entity.JobFk;
					});

					if (recsWithSameRole && recsWithSameRole.length) {
						res = false;
					}
				}

				if (!res) {
					res = {
						apply: true, valid: false, error: message2
					};
				} else {
					platformDataValidationService.removeFromErrorList(entity, compositeModel, self, projectMainTimekeepingClerkDataService);
					platformRuntimeDataService.applyValidationResult(true, entity, compositeModel);
				}
			}

			return platformDataValidationService.finishValidation(res, entity, value, model, self, projectMainTimekeepingClerkDataService);
		}
		this.validateClerkRoleFk = function validateClerkRoleFk(entity, value, model) {
			return doValidateClerkAndRole(entity, value, model,'ClerkFk', entity.ClerkFk,'Clerk role must be set', 'Clerk role must be unique');
		};

		this.validateAdditionalClerkFk = function validateAdditionalClerkFk(entity, value, model) {
			return doValidateClerkAndRole(entity, value, model,'ClerkRoleFk', entity.ClerkRoleFk,'Clerk must be set', 'Clerk must be unique');
		};

		this.asyncValidateAdditionalClerkFk = function asyncValidateClerkFk(entity, value, model) {
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, projectMainTimekeepingClerkDataService);
			entity.ClerkFk = value;

			asyncMarker.myPromise = $http.get(globals.webApiBaseUrl + 'basics/clerk/getClerkById?clerkId='+ value).then(function (result) {
				let res = {valid: true, apply: true};
				if(result && result.data){
					doValidateClerkAndRole(entity, value, model,'ClerkRoleFk', entity.ClerkRoleFk,'Clerk must be set', 'Clerk must be unique');
				}
				platformDataValidationService.finishAsyncValidation(res, entity, value, model, asyncMarker, self, projectMainTimekeepingClerkDataService);
				return res;
			});
			return asyncMarker.myPromise;
		};
	}
})(angular);
