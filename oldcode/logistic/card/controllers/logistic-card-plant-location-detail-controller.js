/**
 * Created by Nikhil on 17.07.2023
 */

(function (angular) {
	'use strict';
	const moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardPlantLocationDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource equipment location entities.
	 **/
	angular.module(moduleName).controller('logisticCardPlantLocationDetailController', LogisticCardPlantLocationDetailController);

	LogisticCardPlantLocationDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'logisticCardPlantLocationDataService', 'logisticCardConstantValues'];

	function LogisticCardPlantLocationDetailController($scope, platformContainerControllerService,
		logisticCardPlantLocationDataService, logisticCardConstantValues){

		platformContainerControllerService.initController($scope, moduleName, logisticCardConstantValues.uuid.container.plantLocationDetails);
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				logisticCardPlantLocationDataService.getDeadlineButtonConfig()
			]
		});
	}
})(angular);