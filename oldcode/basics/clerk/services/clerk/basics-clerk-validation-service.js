/**
 * Created by baf on 04.09.2014.
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'basics.clerk';
	/**
	 * @ngdoc service
	 * @name BasicsClerkValidationService
	 * @description provides validation methods for entities
	 */
	angular.module(moduleName).service('basicsClerkValidationService', BasicsClerkValidationService);

	BasicsClerkValidationService.$inject = ['$q', '$http', '$translate', 'platformDataValidationService', 'basicsClerkMainService'];

	function BasicsClerkValidationService($q, $http, $translate, platformDataValidationService, basicsClerkMainService) {
		var self = this;

		self.validateCode = function (entity, value, model) {
			var items = basicsClerkMainService.getList();
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, self, basicsClerkMainService);
		};

		self.validateDescription = function validateDescription(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsClerkMainService);
		};

		this.validateValidFrom = function validateStartDate(entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, self, basicsClerkMainService, 'ValidTo');
		};

		this.validateValidTo = function validateEndDate(entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, self, basicsClerkMainService, 'ValidFrom');
		};

		self.validateWorkflowType = function validateWorkflowType(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsClerkMainService);
		};

		self.validateTxPw = function validateTxPw(entity) {
			entity.IsTxUserChanged = true;
			return true;
		};

		self.asyncValidateUserFk = function asyncValidateUserFk(entity, value, model) {
			if (value !== null) {
				return $http.get(globals.webApiBaseUrl + 'basics/clerk/clerkByUser?userId=' + value).then(function (result) {
						if (result.data !== undefined && result.data !== null &&
							result.data !== '' && result.data.Id !== entity.Id) {
							return platformDataValidationService.finishValidation({
								valid: false,
								error: $translate.instant('basics.clerk.userAlreadyExistsError')
							}, entity, value, model, self, basicsClerkMainService);
						} else {
							var userIds = [value];
							return $http.post(globals.webApiBaseUrl + 'usermanagement/main/user/getUsersByIds', userIds).then(function (item) {
									if(!_.isNil(item.data[0])){
										entity.Email = item.data[0].Email;
									}
									return platformDataValidationService.finishValidation({valid: true}, entity, value, model, self, basicsClerkMainService);
								},
								function (/* error */) {
								});
						}
					},
					function (/* error */) {
					});

			} else {
				platformDataValidationService.finishValidation({valid: true}, entity, value, model, self, basicsClerkMainService);
				return $q.when(true);
			}


		};
	}

})(angular);




