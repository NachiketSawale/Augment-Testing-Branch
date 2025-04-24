/**
 * Created by Frank Baedeker on 14.01.2015.
 */

(function (angular) {
	'use strict';
	/* global globals */

	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainProjectValidationService
	 * @description provides validation methods for project clerk entities
	 */
	angular.module(moduleName).service('projectMainClerkValidationService', ProjectMainClerkValidationService);

	ProjectMainClerkValidationService.$inject = ['$http', '$injector','projectClerkService', 'platformDataValidationService', 'basicsCustomClerkRoleLookupDataService', 'platformRuntimeDataService','projectMainConstantValues','platformValidationServiceFactory', 'platformValidationRevalidationEntitiesFactory'];

	function ProjectMainClerkValidationService($http, $injector, projectClerkService, platformDataValidationService, basicsCustomClerkRoleLookupDataService, platformRuntimeDataService, projectMainConstantValues, platformValidationServiceFactory, platformValidationRevalidationEntitiesFactory) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(projectMainConstantValues.schemes.project2Clerk, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(projectMainConstantValues.schemes.project2Clerk),
			uniques: []
		},
		self,
		projectClerkService);
		let specification = {
			customValidations: [
				{
					model: 'ClerkFk',
					revalidateGrid: [{}],
					revalidateOnlySameEntity: true
				}
			],
			globals: {
				revalidateCellOnlyIfHasError: false,
				revalidateOnlySameEntity: false,
				revalidateGrid: false
			}
		};
		platformValidationRevalidationEntitiesFactory.addValidationServiceInterface(
			projectMainConstantValues.schemes.project2Clerk,
			specification,
			self,
			projectClerkService
		);
		function doIntersect(l, r) {
			return l.ValidFrom <= r.ValidFrom && l.ValidTo > r.ValidFrom || l.ValidFrom < r.ValidTo && l.ValidTo >= r.ValidTo || l.ValidFrom > r.ValidFrom && l.ValidTo < r.ValidTo;
		}


		function doValidateClerkAndRole(entity, value, model, compositeModel, compositeValue, message1, message2){
			var res = true;
			if (!value) {
				res = {
					apply: false, valid: false, error: message1
				};
			} else {
				var roleFkValue = model === 'ClerkRoleFk' ? value : compositeValue;
				var cr = basicsCustomClerkRoleLookupDataService.getItemById(roleFkValue, {lookupType: 'basicsCustomClerkRoleLookupDataService'});
				if (cr && cr.IsUnique) {
					var recsWithSameRole = _.filter(projectClerkService.getList(), function (cl) {
						// KH: tmp fix for ALM #103651
						return cl[model] === value && cl[compositeModel] === compositeValue;
					});

					if (recsWithSameRole && recsWithSameRole.length) {
						if (entity.ValidFrom && entity.ValidTo) {
							var overlapping = _.filter(projectClerkService.getList(), function (cl) {
								return doIntersect(entity, cl);
							});

							if (overlapping && overlapping.length) {
								res = false;
							}
						} else {
							res = false;
						}
					}
				}

				if (!res) {
					res = {
						apply: true, valid: false, error: message2
					};
				} else {
					platformDataValidationService.removeFromErrorList(entity, compositeModel, self, projectClerkService);
					platformRuntimeDataService.applyValidationResult(true, entity, compositeModel);
				}
			}

			return platformDataValidationService.finishValidation(res, entity, value, model, self, projectClerkService);
		}
		this.validateClerkRoleFk = function validateClerkRoleFk(entity, value, model) {
			return doValidateClerkAndRole(entity, value, model,'ClerkFk', entity.ClerkFk,'Clerk role must be set', 'Clerk role must be unique');
		};

		this.validateAdditionalClerkFk = function validateAdditionalClerkFk(entity, value, model) {
			return doValidateClerkAndRole(entity, value, model,'ClerkRoleFk', entity.ClerkRoleFk,'Clerk must be set', 'Clerk must be unique');
		};

		this.asyncValidateAdditionalClerkFk = function asyncValidateClerkFk(entity, value, model) {
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, projectClerkService);
			entity.ClerkFk = value;

			asyncMarker.myPromise = $http.get(globals.webApiBaseUrl + 'basics/clerk/getClerkById?clerkId='+ value).then(function (result) {
				let res = {valid: true, apply: true};
				if(result && result.data){
					entity.Address = result.data.Address;
					entity.Email = result.data.Email;
					entity.TelephoneMobil = result.data.TelephoneMobil;
					entity.TelephoneNumber = result.data.TelephoneNumber;
					entity.TelephoneNumberTelefax = result.data.TelephoneNumberTelefax;
					entity.TelephonePrivat = result.data.TelephonePrivat;
					entity.TelephonePrivatMobil = result.data.TelephonePrivatMobil;
					doValidateClerkAndRole(entity, value, model,'ClerkRoleFk', entity.ClerkRoleFk,'Clerk must be set', 'Clerk must be unique');
				}
				platformDataValidationService.finishAsyncValidation(res, entity, value, model, asyncMarker, self, projectClerkService);
				return res;
			});
			return asyncMarker.myPromise;
		};

		this.validateValidFrom = function validateValidFrom(entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, self, projectClerkService, 'ValidTo');
		};

		this.validateValidTo = function validateValidTo(entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, self, projectClerkService, 'ValidFrom');
		};

	}
})(angular);
