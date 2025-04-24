(function (angular) {

	'use strict';

	angular.module('basics.characteristic').factory('basicsCharacteristicDataValidationService', ['$http', 'platformDataValidationService', 'basicsCharacteristicCharacteristicService',
		function ($http, platformDataValidationService, dataService) {
			var service = {};

			service.validateCode = function (entity, value, model) {
				// return platformDataValidationService.isMandatory(value, 'Code');
				var items = dataService.getList();
				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, service, dataService);
			};

			return service;
		}
	]);
})(angular);
