
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsClerkMemberValidationService
	 * @description provides validation methods for clerk-member instances
	 */
	angular.module('basics.clerk').factory('basicsClerkMemberValidationService', ['globals', 'platformDataValidationService', 'basicsClerkMemberService', '$http',

		function (globals, platformDataValidationService, basicsClerkMemberService, $http) {

			var self = this;

			self.asyncValidateClerkGroupFk = function asyncValidateClerkGroupFk(entity, modelValue, field) {
				var valData = {mainItemId: entity.ClerkFk, parentId: modelValue};

				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, field, modelValue, basicsClerkMemberService);
				return $http.post(globals.webApiBaseUrl + 'basics/clerk/group/validate', valData
				).then(function (response) {
					return platformDataValidationService.finishAsyncValidation({
						apply: true,
						valid: response.data,
						error$tr$: 'basics.clerk.noValidClerkGroup'
					}, entity,
					modelValue, field, asyncMarker, this, basicsClerkMemberService);
				},
				function () {
					return platformDataValidationService.finishAsyncValidation({
						apply: false,
						valid: false,
						error$tr$: 'basics.clerk.noValidClerkGroup'
					}, entity,
					modelValue, field, asyncMarker, this, basicsClerkMemberService);
				}
				);
			};

			return self;
		}

	]);

})(angular);
