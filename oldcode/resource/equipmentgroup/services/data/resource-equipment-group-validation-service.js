/**
 * Created by baf on 2017-08-29.
 */

(function (angular) {
	/* global globals */
	'use strict';
	var modName = 'resource.equipmentgroup';
	var module = angular.module(modName);

	/*
	 * @ngdoc service
	 * @name resourceTypeValidationService
	 * @description provides validation methods for information request entities
	 */
	module.service('resourceEquipmentGroupValidationService', ResourceEquipmentGroupValidationService);

	ResourceEquipmentGroupValidationService.$inject = ['$injector', '$q', '$http', '$translate',
		'platformValidationServiceFactory', 'platformRuntimeDataService', 'platformDataValidationService',
		'resourceEquipmentGroupConstantValues', 'resourceEquipmentGroupDataService'];

	function ResourceEquipmentGroupValidationService($injector, $q, $http, $translate,
		platformValidationServiceFactory,platformRuntimeDataService,platformDataValidationService,
		resourceEquipmentGroupConstantValues, resourceEquipmentGroupDataService) {

		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(
			{
				typeName: 'EquipmentGroupDto',
				moduleSubModule: 'Resource.EquipmentGroup'
			},
			{
				mandatory: ['RubricCategoryFk'],
				uniques: ['Code']
			},
			self,
			resourceEquipmentGroupDataService);

		this.asyncValidateCode = function asyncValidateCode (entity, value, model) {
			var param = $translate.instant('cloud.common.entityCode');

			return applyAsyncFieldTest({ Field2Validate: resourceEquipmentGroupConstantValues.groupProperties.Code, NewStringValue: value, Id: entity.Id }, entity, value, model, 'cloud.common.uniqueValueErrorMessage', param);
		};

		function applyAsyncFieldTest(validationSpec, entity, value, model, errorCode, errorParam ) {
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, resourceEquipmentGroupDataService);
			asyncMarker.myPromise =  $http.post(globals.webApiBaseUrl + 'resource/equipmentgroup/validate', validationSpec).then(function (result) {
				if (!result.data.ValidationResult) {
					return platformDataValidationService.finishAsyncValidation({
						valid: false,
						apply: true,
						error: '...',
						error$tr$: errorCode,
						error$tr$param$: { object: errorParam.toLowerCase() || model.toLowerCase() }
					}, entity, value, model, asyncMarker, self, resourceEquipmentGroupDataService);
				} else {
					return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, resourceEquipmentGroupDataService);
				}
			});

			return asyncMarker.myPromise;
		}
	}
})(angular);
