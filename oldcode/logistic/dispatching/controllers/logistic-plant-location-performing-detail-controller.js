/**
 * Created by nitsche on 30.04.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticPlantLocationPerformingDetailController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic plant  entities.
	 **/
	angular.module(moduleName).controller('logisticPlantLocationPerformingDetailController', LogisticPlantLocationPerformingDetailController);

	LogisticPlantLocationPerformingDetailController.$inject = ['$scope', 'platformContainerControllerService','logisticDispatchingPlantLocationPerformingDataService'];

	function LogisticPlantLocationPerformingDetailController($scope, platformContainerControllerService,logisticDispatchingPlantLocationPerformingDataService) {
		platformContainerControllerService.initController($scope, moduleName, '80c969bbf91a4dc89c2c3a9ba5645a03');
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				logisticDispatchingPlantLocationPerformingDataService.getDeadlineButtonConfig()
			]
		});
	}
})(angular);