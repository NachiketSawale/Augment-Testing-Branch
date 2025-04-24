(function (angular) {

	'use strict';

	angular.module('basics.characteristic').factory('basicsCharacteristicCharacteristicValidationService', [
		'$q', '$http', 'platformDataValidationService', 'basicsCharacteristicCharacteristicService',
		function ($q, $http, platformDataValidationService, dataService) {
			var service = {};

			service.validateCode = function validateCode(entity, value, model) {
				var resultMandatory = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
				if (resultMandatory.valid){
					var itemList = dataService.getList();
					var item = _.find(itemList, function (item) {
						return item[model] === value && item.CharacteristicGroupFk === entity.CharacteristicGroupFk && item.Id !== entity.Id;
					});
					var resultUnique = platformDataValidationService.createSuccessObject();
					if(item) {
						resultUnique =  platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', {object: model.toLowerCase() });
						platformDataValidationService.finishValidation(resultUnique, entity, value, model, service, dataService);
					}
					return resultUnique;
				}
				return resultMandatory;
			};

			service.validateValidFrom = function validateValidFrom(entity, value, model) {
				return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, service, dataService, 'ValidTo');
			};

			service.validateValidTo = function validateValidTo(entity, value, model) {
				return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, service, dataService, 'ValidFrom');
			};

			service.validateDefaultValue = function validateDefaultValue(entity, value, model) {
				entity.DefaultValue = value;
				dataService.gridRefresh();

				if (entity.CharacteristicTypeFk === 10) {//When the type is lookup and the default value changed, let the parent container know.
					dataService.defaultValueChanged.fire(null, entity);
				}

				return platformDataValidationService.finishValidation({apply: true, valid: true, error: ''}, entity, value, model, service, dataService);
			};

			service.validateCharacteristicTypeFk = function validateCharacteristicTypeFk(entity, value, model) {
				entity.CharacteristicTypeFk = value;
				dataService.characteristicTypeModified(entity);

				return platformDataValidationService.finishValidation({apply: true, valid: true, error: ''}, entity, value, model, service, dataService);
			};

			return service;
		}
	]);
})(angular);
