(function () {

	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobRequiredByDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of any kind of entity belonging to an asset
	 **/
	angular.module(moduleName).controller('logisticJobRequiredByDetailController', LogisticJobRequiredByDetailController);

	LogisticJobRequiredByDetailController.$inject = ['$scope', 'platformContainerControllerService','logisticJobContainerInformationService', 'logisticJobRequiredByContainerService'];

	function LogisticJobRequiredByDetailController($scope, platformContainerControllerService, logisticJobContainerInformationService, logisticJobRequiredByContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		if(!logisticJobContainerInformationService.hasDynamic(containerUid)) {
			logisticJobRequiredByContainerService.prepareDetailConfig(containerUid, $scope, logisticJobContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();