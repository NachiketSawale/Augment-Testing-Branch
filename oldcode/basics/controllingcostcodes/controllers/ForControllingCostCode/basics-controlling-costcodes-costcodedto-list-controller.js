(function () {

	'use strict';
	let moduleName = 'basics.controllingcostcodes';

	/**
	 * @ngdoc controller
	 * @name basicsControllingCostcodesCostCodeDtoListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a change in a Controlling costcode
	 **/


	angular.module(moduleName).controller('basicsControllingCostcodesCostCodeDtoListController', basicsControllingCostcodesCostCodeDtoListController);

	basicsControllingCostcodesCostCodeDtoListController.$inject = ['$scope', 'platformContainerControllerService','basicsControllingcostcodesContainerInformationService', 'basicsContrlCostcodesForControllingcostcodeContainerService'];

	function basicsControllingCostcodesCostCodeDtoListController($scope, platformContainerControllerService, basicsControllingcostcodesContainerInformationService, basicsContrlCostcodesForControllingcostcodeContainerService) {
		let containerUid = $scope.getContentValue('uuid');

		basicsContrlCostcodesForControllingcostcodeContainerService.prepareGridConfig(containerUid, $scope, basicsControllingcostcodesContainerInformationService);

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}

})(angular);