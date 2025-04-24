(function (angular) {
	'use strict';
	angular.module('basics.characteristic').factory('basicsCharacteristicGroupValidationService', ['$http', '$translate', 'platformDataValidationService', function ($http, $translate, platformDataValidationService) {
		var service = {};
		service.validateModel = function () {

		};
		service.validateDescriptionInfo = function (entity, value) {
			return platformDataValidationService.isMandatory(value, 'Description');
		};
		return service;
	}]);
})(angular);
