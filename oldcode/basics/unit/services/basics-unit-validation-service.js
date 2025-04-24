(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsUnitValidationService
	 * @description provides validation methods for unit instances
	 */
	angular.module('basics.unit').service('basicsUnitValidationService', BasicsUnitValidationService);

	BasicsUnitValidationService.$inject = ['_', '$q', '$http', 'platformDataValidationService', 'basicsUnitMainService', 'basicsCommonCodeDescriptionSettingsService'];

	function BasicsUnitValidationService(_, $q, $http, platformDataValidationService, basicsUnitMainService, basicsCommonCodeDescriptionSettingsService) {
		var self = this;
		var codeMaxLength = -1;

		function assertCodeMaxLength() {
			if(codeMaxLength === -1) {
				var settings = basicsCommonCodeDescriptionSettingsService.getSettings([{typeName: 'UomEntity', modul: 'Basics.Unit'}]);
				if(settings && _.isObject(settings)) {
					codeMaxLength = settings[0].codeLength;
				} else {
					codeMaxLength = 4;
				}
			}
		}

		this.validateUnitInfo = function validateUnitInfo(entity, value) {
			var model = 'UnitInfo.Translated';
			assertCodeMaxLength();
			if(value && value.length > codeMaxLength)
			{
				var result = platformDataValidationService.createErrorObject('cloud.common.Error_StringTooLong', { p_0: codeMaxLength });// jshint ignore:line
				return platformDataValidationService.finishValidation(result, entity, value, model, self, basicsUnitMainService);
			} else {
				platformDataValidationService.removeFromErrorList(entity, model, self, basicsUnitMainService);
				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, basicsUnitMainService.getList(), self, basicsUnitMainService);
			}
		};

		this.validateUomTypeFk = function validateUomType(entity, value, model) {
			if(value !== 1){
				var items = basicsUnitMainService.getList();
				return platformDataValidationService.validateMandatoryUniqErrorEntity(entity, value, model, items, self, basicsUnitMainService, 'Type');
			}else{
				return platformDataValidationService.finishValidation(true, entity, value, model, self, basicsUnitMainService);
			}
		};

		this.validateLengthDimension = function validateUomLengthDimension(entity, value, model) {
			var result = true;
			if(value > 5 || value < -5){
				result = platformDataValidationService.createErrorObject('cloud.common.Error_ValueOutOfRange',{object: model.toLowerCase()});
			}
			return platformDataValidationService.finishValidation(result, entity, value, model, self, basicsUnitMainService);
		};

		this.validateTimeDimension = function validateUomTimeDimension(entity, value, model) {
			var result = true;
			if(value > 5 || value < -5){
				result = platformDataValidationService.createErrorObject('cloud.common.Error_ValueOutOfRange',{object: model.toLowerCase()});
			}
			return platformDataValidationService.finishValidation(result, entity, value, model, self, basicsUnitMainService);
		};

		this.validateMassDimension = function validateUomMassDimension(entity, value, model) {
			var result = true;
			if(value > 5 || value < -5){
				result = platformDataValidationService.createErrorObject('cloud.common.Error_ValueOutOfRange',{object: model.toLowerCase()});
			}
			return platformDataValidationService.finishValidation(result, entity, value, model, self, basicsUnitMainService);
		};

		this.validateIsBase = function validateUomIsBase(entity, value, model) {
			var result = true;
			if(value === 'true' && basicsUnitMainService.hasBaseUnitForDimension(entity)) {
				result = platformDataValidationService.createErrorObject('basics.unit.errorOnlyOneBaseUnitAllowed',{object: model.toLowerCase()});
			}

			return platformDataValidationService.finishValidation(result, entity, value, model, self, basicsUnitMainService);
		};

		this.validateIsoCode = function validateIsoCode(entity, value, model) {
			if(!value) {
				return platformDataValidationService.finishValidation(true, entity, value, model, self, basicsUnitMainService);;
			}
			let filteredList = basicsUnitMainService.getList();

			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, filteredList, self, basicsUnitMainService);
		};

		this.asyncValidateIsoCode = function(entity, value, model) {
			if(!value) {
				return $q.when(platformDataValidationService.finishValidation(true, entity, value, model, self, basicsUnitMainService));
			}

			const isunique = {
				Id: entity.Id,
				IsoCode: value
			};
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, basicsUnitMainService);

			asyncMarker.myPromise =
				$http.post(globals.webApiBaseUrl + 'basics/unit/isocodeunique', isunique).then(function (result) {
					if (result.data && _.isObject(result.data)) {
						return platformDataValidationService.finishAsyncValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'basics.unit.isoCodeMustBeUnique',
							error$tr$param: {}
						}, entity, value, model, asyncMarker, self, basicsUnitMainService);
					} else {
						return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, basicsUnitMainService);
					}
				});

			return asyncMarker.myPromise;

		}
	}
})(angular);
