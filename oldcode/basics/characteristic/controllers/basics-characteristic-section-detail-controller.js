(function (angular) {
	'use strict';
	var moduleName = 'basics.characteristic';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCharacteristicSectionDetailController', ['$scope', 'platformDetailControllerService', 'basicsCharacteristicSectionService', 'basicsCharacteristicGroupValidationService', 'basicsCharacteristicSectionUIStandardService', 'platformTranslateService',
		function ($scope, platformDetailControllerService, basicsCharacteristicSectionService, basicsCharacteristicGroupValidationService, basicsCharacteristicSectionUIStandardService, platformTranslateService) {
			platformDetailControllerService.initDetailController($scope, basicsCharacteristicSectionService, basicsCharacteristicGroupValidationService, basicsCharacteristicSectionUIStandardService, {
				translateFormConfig: function translateFormConfig(formConfig){
					platformTranslateService.translateFormConfig(formConfig);
				}
			});
		}
	]);
})(angular);