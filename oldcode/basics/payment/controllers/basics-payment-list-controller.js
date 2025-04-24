(function () {

	'use strict';
	var moduleName = 'basics.payment';
	var angModule = angular.module(moduleName);

	angModule.controller('basicsPaymentListController', BasicsPaymentListController);

	BasicsPaymentListController.$inject = ['$scope','platformContainerControllerService','platformTranslateService','basicsPaymentUIStandardService'];
	function BasicsPaymentListController($scope, platformContainerControllerService,platformTranslateService, basicsPaymentUIStandardService) {
		platformTranslateService.translateGridConfig(basicsPaymentUIStandardService.getStandardConfigForListView().columns);

		platformContainerControllerService.initController($scope, moduleName, '24790afafd35416595ef14527d0ba021');
	}
})();