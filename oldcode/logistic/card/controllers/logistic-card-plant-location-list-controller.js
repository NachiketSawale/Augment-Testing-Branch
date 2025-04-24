/**
 * Created by Nikhil on 17.07.2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardPlantLocationListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource equipment location entities.
	 **/

	angular.module(moduleName).controller('logisticCardPlantLocationListController', LogisticCardPlantLocationListController);

	LogisticCardPlantLocationListController.$inject = ['$scope', 'platformContainerControllerService',
		'logisticCardPlantLocationDataService', 'logisticCardConstantValues'];

	function LogisticCardPlantLocationListController($scope, platformContainerControllerService,
		logisticCardPlantLocationDataService, logisticCardConstantValues) {

		platformContainerControllerService.initController($scope, moduleName, logisticCardConstantValues.uuid.container.plantLocationList);
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