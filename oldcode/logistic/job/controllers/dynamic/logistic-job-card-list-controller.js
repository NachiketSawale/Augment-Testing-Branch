(function () {

	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobCardListController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of any kind of entity belonging to a job
	 **/
	angular.module(moduleName).controller('logisticJobCardListController', LogisticJobCardListController);

	LogisticJobCardListController.$inject = ['$scope', 'platformContainerControllerService','logisticJobContainerInformationService', 'logisticJobCardContainerService'];

	function LogisticJobCardListController($scope, platformContainerControllerService, logisticJobContainerInformationService, logisticJobCardContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		if(!logisticJobContainerInformationService.hasDynamic(containerUid)) {
			logisticJobCardContainerService.prepareGridConfig(containerUid, $scope, logisticJobContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();