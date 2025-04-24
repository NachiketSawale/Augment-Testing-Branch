(function () {

	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobCardDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of any kind of entity belonging to a job
	 **/
	angular.module(moduleName).controller('logisticJobCardDetailController', LogisticJobCardDetailController);

	LogisticJobCardDetailController.$inject = ['$scope', 'platformContainerControllerService','logisticJobContainerInformationService', 'logisticJobCardContainerService'];

	function LogisticJobCardDetailController($scope, platformContainerControllerService, logisticJobContainerInformationService, logisticJobCardContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		if(!logisticJobContainerInformationService.hasDynamic(containerUid)) {
			logisticJobCardContainerService.prepareDetailConfig(containerUid, $scope, logisticJobContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();