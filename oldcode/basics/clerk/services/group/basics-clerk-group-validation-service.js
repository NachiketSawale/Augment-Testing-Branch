/**
 * Created by leo on 11.11.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsClerkGroupValidationService
	 * @description provides validation methods for clerk-group instances
	 */
	angular.module('basics.clerk').factory('basicsClerkGroupValidationService', ['globals', 'platformDataValidationService', 'basicsClerkGroupService', '$http',

		function (globals, platformDataValidationService, basicsClerkGroupService, $http) {

			var self = this;

			self.asyncValidateClerkGroupFk = function asyncValidateClerkGroupFk(entity, modelValue, field) {
				var valData = {mainItemId: entity.ClerkFk, parentId: modelValue};

				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, field, modelValue, basicsClerkGroupService);
				return $http.post(globals.webApiBaseUrl + 'basics/clerk/group/validate', valData
				).then(function (response) {
					return platformDataValidationService.finishAsyncValidation({
						apply: true,
						valid: response.data,
						error$tr$: 'basics.clerk.noValidClerkGroup'
					}, entity,
					modelValue, field, asyncMarker, this, basicsClerkGroupService);
				},
				function () {
					return platformDataValidationService.finishAsyncValidation({
						apply: false,
						valid: false,
						error$tr$: 'basics.clerk.noValidClerkGroup'
					}, entity,
					modelValue, field, asyncMarker, this, basicsClerkGroupService);
				}
				);
			};

			return self;
		}

	]);

})(angular);
