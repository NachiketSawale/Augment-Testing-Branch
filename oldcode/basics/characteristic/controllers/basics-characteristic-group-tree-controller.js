(function () {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('basics.characteristic').controller('basicsCharacteristicGroupListController', ['$scope', 'basicsCharacteristicMainService', 'basicsCharacteristicGroupUIStandardService', 'basicsCharacteristicGroupValidationService', 'platformGridControllerService',
		function ($scope, mainService, uiStandardService, validationService, platformGridControllerService) {
			var myGridConfig = {
				initCalled: false,
				columns: [],
				parentProp: 'CharacteristicGroupFk',
				childProp: 'Groups'
			};
			platformGridControllerService.initListController($scope, uiStandardService, mainService, validationService, myGridConfig);
		}
	]);
})();