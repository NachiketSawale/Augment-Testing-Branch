/**
 * Created by nitsche on 30.04.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticPlantLocationReceivingDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic plant  entities.
	 **/
	angular.module(moduleName).controller('logisticPlantLocationReceivingDetailController', LogisticPlantLocationReceivingDetailController);

	LogisticPlantLocationReceivingDetailController.$inject = ['$scope', 'platformContainerControllerService','logisticDispatchingPlantLocationReceivingDataService'];

	function LogisticPlantLocationReceivingDetailController($scope, platformContainerControllerService, logisticDispatchingPlantLocationReceivingDataService) {
		platformContainerControllerService.initController($scope, moduleName, 'df910222f1144c129903771f8a9ed8ef');
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				logisticDispatchingPlantLocationReceivingDataService.getDeadlineButtonConfig()
			]
		});
	}

})(angular);