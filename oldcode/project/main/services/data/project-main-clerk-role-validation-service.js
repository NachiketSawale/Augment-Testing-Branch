/**
 * Created by baf on 14.09.2022
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainClerkRoleValidationService
	 * @description provides validation methods for project main clerkRole entities
	 */
	angular.module(moduleName).service('projectMainClerkRoleValidationService', ProjectMainClerkRoleValidationService);

	ProjectMainClerkRoleValidationService.$inject = ['_', 'moment', '$http', 'platformValidationServiceFactory', 'platformRuntimeDataService',
		'platformDataValidationService', 'basicsCustomClerkRoleLookupDataService', 'projectMainConstantValues', 'projectMainClerkRoleDataService'];

	function ProjectMainClerkRoleValidationService(_, moment, $http, platformValidationServiceFactory, platformRuntimeDataService,
		platformDataValidationService, basicsCustomClerkRoleLookupDataService, projectMainConstantValues, projectMainClerkRoleDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(projectMainConstantValues.schemes.clerkRole, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(projectMainConstantValues.schemes.clerkRole),
			periods: [{ from: 'ValidFrom', to: 'ValidTo'}]
		},
		self,
		projectMainClerkRoleDataService);

		this.asyncValidateClerkFk = function asyncValidateClerkFk(entity, value, model) {
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, projectMainClerkRoleDataService);
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
				}
				platformDataValidationService.finishAsyncValidation(res, entity, value, model, asyncMarker, self, projectMainClerkRoleDataService);
				return res;
			});
			return asyncMarker.myPromise;
		};

		this.validateAdditionalClerkRoleFk = function validateAdditionalClerkRoleFk(entity, value, model) {
			var clerkRole = basicsCustomClerkRoleLookupDataService.getItemById(value, {lookupType: 'basicsCustomClerkRoleLookupDataService'});
			entity.RoleRequiresUniqueness = clerkRole.IsUnique;

			if(entity.RoleRequiresUniqueness) {
				entity.ClerkRoleFk = value;
				return self.validateUniqueRoleIsNotUsedAtSameTimeTwice({
					record: entity,
					records: projectMainClerkRoleDataService.getList(),
					field: model,
					clerkRoleFk: entity.ClerkRoleFk,
					validFrom: value,
					validTo: entity.ValidTo
				});
			}

			return true;
		};

		this.validateAdditionalValidFrom = function validateAdditionalValidFrom(entity, value, model) {
			if(entity.RoleRequiresUniqueness) {
				entity.ValidFrom = value;
				return self.validateUniqueRoleIsNotUsedAtSameTimeTwice({
					record: entity,
					records: projectMainClerkRoleDataService.getList(),
					field: model,
					clerkRoleFk: entity.ClerkRoleFk,
					validFrom: value,
					validTo: entity.ValidTo
				});
			}

			return true;
		};

		this.validateAdditionalValidTo = function validateAdditionalValidTo(entity, value, model) {
			if(entity.RoleRequiresUniqueness) {
				entity.ValidTo = value;
				return self.validateUniqueRoleIsNotUsedAtSameTimeTwice({
					record: entity,
					records: projectMainClerkRoleDataService.getList(),
					field: model,
					clerkRoleFk: entity.ClerkRoleFk,
					validFrom: entity.ValidFrom,
					validTo: value
				});
			}

			return true;
		};

		this.validateUniqueRoleIsNotUsedAtSameTimeTwice = function validateUniqueRoleIsNotUsedAtSameTimeTwice(data) {
			var withSameRole = _.filter(data.records, function(rec) {
				return rec.RoleFk === data.record.RoleFk && rec.Id !== data.record.Id;
			});

			if(_.size(withSameRole) === 0) {
				return platformDataValidationService.finishValidation(true, data.record, data.record.RoleFk, 'ClerkRoleFk', self, projectMainClerkRoleDataService);
			}

			let noOverlappingFound = self.hasNoOverlapping(data.record, withSameRole);

			if(noOverlappingFound) {
				self.reEvaluate(withSameRole);
			}

			return platformDataValidationService.finishValidation({
				valid: noOverlappingFound,
				error: '...',
				error$tr$: 'cloud.common.uniqueValueErrorMessage'
			}, data.record, data.record.RoleFk, 'ClerkRoleFk', self, projectMainClerkRoleDataService);
		};

		this.recordsAreOverlapping = function recordsAreOverlapping(left, right) {
			if(_.isNil(left.ValidFrom) && _.isNil(left.ValidTo)) {
				// left lasts forever -> overlapping is happening for sure
				return true;
			}

			if(_.isNil(right.ValidFrom) && _.isNil(right.ValidTo)) {
				// right lasts forever -> overlapping is happening for sure
				return true;
			}

			if(_.isNil(left.ValidFrom)) {
				if(_.isNil(right.ValidFrom)) {
					// right and left start at the beginning of time -> overlapping is happening for sure
					return true;
				}

				return moment(left.ValidTo).isAfter(moment(right.ValidFrom));
			}

			if(_.isNil(left.ValidTo)) {
				if(_.isNil(right.ValidTo)) {
					// right and left end at the end of time -> overlapping is happening for sure
					return true;
				}

				return moment(right.ValidTo).isAfter(moment(left.ValidFrom));
			}

			if(_.isNil(right.ValidFrom) && moment(right.ValidTo).isAfter(moment(left.ValidFrom))) {
				// right starts at the beginning of time and ends after the start of left
				return true;
			}

			if(_.isNil(right.ValidTo) && moment(left.ValidTo).isAfter(moment(right.ValidFrom))) {
				// right ends at the end of time and starts before the end of left
				return true;
			}

			// all values are set
			if(moment(right.ValidFrom).isAfter(moment(left.ValidFrom)) && moment(left.ValidTo).isAfter(moment(right.ValidFrom))) {
				// right starts after left, but before left ended
				return true;
			}

			if(moment(left.ValidFrom).isAfter(moment(right.ValidFrom)) && moment(right.ValidTo).isAfter(moment(left.ValidFrom))) {
				// left starts after right, but before left right
				return true;
			}

			if(moment(right.ValidFrom).isAfter(moment(left.ValidFrom)) && moment(left.ValidTo).isAfter(moment(right.ValidTo))) {
				// right starts after left and right ends before left
				return true;
			}

			// check if left starts after right and left ends before right
			return moment(left.ValidFrom).isAfter(moment(right.ValidFrom)) && moment(right.ValidTo).isAfter(moment(left.ValidTo));
		};

		this.reEvaluate = function reEvaluate(candidates) {
			var size = _.size(candidates);
			if(size === 0) {
				return;
			}

			_.forEach(candidates, function(candidate) {
				if(self.hasRoleError(candidate)) {
					if(size === 1) {
						self.setRecordValid(candidate);
					} else {
						var allOther = _.filter(candidates, function(rec) {
							return rec.Id !== candidate.Id;
						});

						if(self.hasNoOverlapping(candidate, allOther)) {
							self.setRecordValid(candidate);
						}
					}
				}
			});
		};

		this.setRecordValid = function setRecordValid(record) {
			if(platformRuntimeDataService.hasError(record, 'ClerkRoleFk')) {
				platformRuntimeDataService.applyValidationResult(true, record, 'ClerkRoleFk');
				platformDataValidationService.finishValidation(true, record, record.ClerkRoleFk, 'ClerkRoleFk', self, projectMainClerkRoleDataService);
			}

			if(platformRuntimeDataService.hasError(record, 'ValidFrom')) {
				platformRuntimeDataService.applyValidationResult(true, record, 'ValidFrom');
				platformDataValidationService.finishValidation(true, record, record.ValidFrom, 'ValidFrom', self, projectMainClerkRoleDataService);
			}

			if(platformRuntimeDataService.hasError(record, 'ValidTo')) {
				platformRuntimeDataService.applyValidationResult(true, record, 'ValidTo');
				platformDataValidationService.finishValidation(true, record, record.ValidTo, 'ValidTo', self, projectMainClerkRoleDataService);
			}
			projectMainClerkRoleDataService.fireItemModified(record);
		};

		this.hasRoleError = function hasRoleError(record) {
			return platformRuntimeDataService.hasError(record, 'ClerkRoleFk') ||
			platformRuntimeDataService.hasError(record, 'ValidFrom') ||
			platformRuntimeDataService.hasError(record, 'ValidTo');
		};

		this.hasNoOverlapping = function hasNoOverlapping(candidate, otherRecords) {
			let noOverlappingFound = true;

			_.forEach(otherRecords, function(rec) {
				if(self.recordsAreOverlapping(rec, candidate)) {
					noOverlappingFound = false;
				}
			});

			return noOverlappingFound;
		};
	}
})(angular);
