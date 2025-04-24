(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('basics.characteristic').controller('basicsCharacteristicCharacteristicDetailController', ['$scope', 'platformDetailControllerService', 'basicsCharacteristicCharacteristicService', 'basicsCharacteristicCharacteristicValidationService', 'basicsCharacteristicCharacteristicUIStandardService', 'platformTranslateService',
		function ($scope, platformDetailControllerService, dataService, validationService, uiStandardService, translateService) {
			platformDetailControllerService.initDetailController($scope, dataService, validationService, uiStandardService, translateService);
		}
	]);
})(angular);