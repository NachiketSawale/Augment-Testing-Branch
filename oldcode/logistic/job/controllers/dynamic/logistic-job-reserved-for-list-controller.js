(function () {

	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobReservedForListController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of any kind of entity belonging to an asset
	 **/
	angular.module(moduleName).controller('logisticJobReservedForListController', LogisticJobReservedForListController);

	LogisticJobReservedForListController.$inject = ['$scope', 'platformContainerControllerService','logisticJobContainerInformationService', 'logisticJobReservedForContainerService'];

	function LogisticJobReservedForListController($scope, platformContainerControllerService, logisticJobContainerInformationService, logisticJobReservedForContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		if(!logisticJobContainerInformationService.hasDynamic(containerUid)) {
			logisticJobReservedForContainerService.prepareGridConfig(containerUid, $scope, logisticJobContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();