(function () {

	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobReservedForDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of any kind of entity belonging to an asset
	 **/
	angular.module(moduleName).controller('logisticJobReservedForDetailController', LogisticJobReservedForDetailController);

	LogisticJobReservedForDetailController.$inject = ['$scope', 'platformContainerControllerService','logisticJobContainerInformationService', 'logisticJobReservedForContainerService'];

	function LogisticJobReservedForDetailController($scope, platformContainerControllerService, logisticJobContainerInformationService, logisticJobReservedForContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		if(!logisticJobContainerInformationService.hasDynamic(containerUid)) {
			logisticJobReservedForContainerService.prepareDetailConfig(containerUid, $scope, logisticJobContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();