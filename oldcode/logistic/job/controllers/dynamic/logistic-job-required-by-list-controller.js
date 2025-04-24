(function () {

	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobRequiredByListController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of any kind of entity belonging to an asset
	 **/
	angular.module(moduleName).controller('logisticJobRequiredByListController', LogisticJobRequiredByListController);

	LogisticJobRequiredByListController.$inject = ['$scope', 'platformContainerControllerService','logisticJobContainerInformationService', 'logisticJobRequiredByContainerService'];

	function LogisticJobRequiredByListController($scope, platformContainerControllerService, logisticJobContainerInformationService, logisticJobRequiredByContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		if(!logisticJobContainerInformationService.hasDynamic(containerUid)) {
			logisticJobRequiredByContainerService.prepareGridConfig(containerUid, $scope, logisticJobContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();