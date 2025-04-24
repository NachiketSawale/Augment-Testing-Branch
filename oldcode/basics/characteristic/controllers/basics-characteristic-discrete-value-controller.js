(function () {
	'use strict';
	angular.module('basics.characteristic').controller('basicsCharacteristicDiscreteValueController', ['$scope', 'basicsCharacteristicDiscreteValueService', 'basicsCharacteristicDiscreteValueUIStandardService', 'basicsCharacteristicDiscreteValueValidationService', 'platformGridControllerService',
		function ($scope, dataService, uiStandardService, validationService, platformGridControllerService) {
			var myGridConfig = {
				initCalled: false,
				columns: []
			};
			platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, myGridConfig);
		}
	]);
})();