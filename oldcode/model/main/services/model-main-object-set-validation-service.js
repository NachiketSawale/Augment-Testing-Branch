/**
 * Created by leo on 20.09.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'model.main';

	/**
	 * @ngdoc service
	 * @name modelMainObjectSetValidationService
	 * @description provides validation methods for model object property entities
	 */
	angular.module(moduleName).service('modelMainObjectSetValidationService', modelMainObjectSetValidationService);

	modelMainObjectSetValidationService.$inject = ['platformDataValidationService', '$injector'];
	function modelMainObjectSetValidationService(platformDataValidationService, $injector) {

		var service = {};
		var dataService = $injector.get('modelMainObjectSetDataService');

		service.validateObjectSetStatusFk = function (entity, value) {
			if(value > 0) {
				return platformDataValidationService.validateMandatory(entity, value, 'ObjectSetStatusFk', service, dataService);
			} else {
				var result = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: 'objectsetstatusfk'} );
				return platformDataValidationService.finishValidation(result, entity, value, 'ObjectSetStatusFk', service, dataService);
			}
		};
		service.validateObjectSetTypeFk = function (entity, value) {
			if(value > 0) {
				return platformDataValidationService.validateMandatory(entity, value, 'ObjectSetTypeFk', service, dataService);
			} else {
				var result = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: 'objectsettypefk'} );
				return platformDataValidationService.finishValidation(result, entity, value, 'ObjectSetTypeFk', service, dataService);
			}
		};

		return service;
	}

})(angular);
