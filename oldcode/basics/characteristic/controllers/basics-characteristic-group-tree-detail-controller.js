(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('basics.characteristic').controller('basicsCharacteristicGroupTreeDetailController', ['$scope', 'platformDetailControllerService', 'basicsCharacteristicMainService', 'basicsCharacteristicGroupValidationService', 'basicsCharacteristicGroupUIStandardService', 'platformTranslateService',
		function ($scope, platformDetailControllerService, mainService, validationService, uiStandardService, translateService) {
			platformDetailControllerService.initDetailController($scope, mainService, validationService, uiStandardService, translateService);
		}
	]);
})(angular);