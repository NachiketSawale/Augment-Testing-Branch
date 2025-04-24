/**
 * Created by baf on 24.04.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'resource.wot';

	/**
	 * @ngdoc service
	 * @name resourceWotWorkOperationTypeValidationService
	 * @description provides validation methods for resource wot workOperationType entities
	 */
	angular.module(moduleName).service('resourceWotWorkOperationTypeValidationService', ResourceWotWorkOperationTypeValidationService);

	ResourceWotWorkOperationTypeValidationService.$inject = ['$translate', '$http', 'platformValidationServiceFactory',
		'platformDataValidationService', 'resourceWotConstantValues', 'resourceWotWorkOperationTypeDataService',
		'resourceWotWorkOperationTypeProcessor'];

	function ResourceWotWorkOperationTypeValidationService($translate, $http, platformValidationServiceFactory,
		platformDataValidationService, resourceWotConstantValues, resourceWotWorkOperationTypeDataService,
		resourceWotWorkOperationTypeProcessor) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceWotConstantValues.schemes.workOperationType, {
			mandatory: ['Code', 'EquipmentContextFk'],
			uniques: []
		},
		self,
		resourceWotWorkOperationTypeDataService);

		this.validateCodeInfo = function validateCodeInfo(entity, value /* , model */) {
			return self.validateCode(entity, value, 'Code');
		};

		this.validateCode = function validateCode(entity, value, model) {
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, resourceWotWorkOperationTypeDataService.getList(), self, resourceWotWorkOperationTypeDataService);
		};

		this.asyncValidateCodeInfo = function asyncValidateCodeInfo(entity, value /* , model */) {
			return self.asyncValidateCode(entity, value, 'Code');
		};

		this.asyncValidateCode = function asyncValidateCode(entity, value, model) {
			var isunique = {
				Id: entity.Id,
				Code: value,
				EquipmentContext: entity.EquipmentContextFk
			};
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, resourceWotWorkOperationTypeDataService);

			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'resource/wot/workoperationtype/isunique', isunique).then(function (result) {
				if (!result.data) {
					return platformDataValidationService.finishAsyncValidation({
						valid: false,
						apply: true,
						error: '...',
						error$tr$: 'cloud.common.uniqueValueErrorMessage',
						error$tr$param: { object: $translate.instant('cloud.common.entityCode') }
					}, entity, value, model, asyncMarker, self, resourceWotWorkOperationTypeDataService);
				} else {
					return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, resourceWotWorkOperationTypeDataService);
				}
			});

			return asyncMarker.myPromise;
		};

		this.validateIsMinorEquipment = function validateIsMinorEquipment(entity, value, model) {
			if(value) {
				entity.IsHire = false;
			}
			resourceWotWorkOperationTypeProcessor.setIsHireColumnReadOnly(entity, value);

			return true;
		};
	}
})(angular);
