(function () {

	'use strict';
	var moduleName = 'productionplanning.header';
	var angModule = angular.module(moduleName);

	angModule.controller('productionplanningHeader2BpDetailController', DetailController);

	DetailController.$inject = ['$scope', 'platformDetailControllerService',
		'productionplanningHeader2BpDataService',
		'productionplanningHeader2BpUIStandardService',
		'productionplanningHeader2BpValidationService'];
	function DetailController($scope, platformDetailControllerService,
							  dataServ,
							  uiStandardServ,
							  validationServ) {

		platformDetailControllerService.initDetailController($scope, dataServ, validationServ, uiStandardServ, 'productionplanningHeaderTranslationService');
	}
})();