(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'logistic.job';
	var angModule = angular.module(moduleName);

	angModule.controller('logisticJobListController', LogisticJobListController);

	LogisticJobListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '11091450f3e94dc7ae58cbb563dfecad');
	}
})();