/**
 * Created by lav on 4/14/2020.
 */
(function (angular) {

	'use strict';

	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).controller('transportplanningRequisitionTrsGoodsDetailController', ListController);

	ListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ListController($scope, platformContainerControllerService) {

		var moduleNameA = $scope.getContentValue('moduleName') || moduleName;
		var containerUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleNameA, containerUid);
	}

})(angular);
