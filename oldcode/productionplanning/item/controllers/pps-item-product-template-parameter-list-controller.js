(function (angular) {

	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('ppsItemProductTemplateParameterListController', ProductTemplateParameterListController);

	ProductTemplateParameterListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProductTemplateParameterListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, $scope.getContentValue('uuid'));
	}

})(angular);