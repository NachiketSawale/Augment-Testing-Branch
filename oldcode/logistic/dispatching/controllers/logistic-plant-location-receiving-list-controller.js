/**
 * Created by nitsche on 30.04.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticPlantLocationReceivingListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic plant  entities.
	 **/

	angular.module(moduleName).controller('logisticPlantLocationReceivingListController', LogisticPlantLocationReceivingListController);

	LogisticPlantLocationReceivingListController.$inject = ['$scope', 'logisticJobPlantLocationListControllerBase', 'logisticDispatchingPlantLocationReceivingDataService'];

	function LogisticPlantLocationReceivingListController($scope, logisticJobPlantLocationListControllerBase, logisticDispatchingPlantLocationReceivingDataService) {
		logisticJobPlantLocationListControllerBase.initController($scope, moduleName, '310e1b7ca2f94feba6d8732b38c8374d', undefined, logisticDispatchingPlantLocationReceivingDataService);
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				logisticDispatchingPlantLocationReceivingDataService.getDeadlineButtonConfig(),
				logisticDispatchingPlantLocationReceivingDataService.getDetailsButtonConfig(),
				logisticDispatchingPlantLocationReceivingDataService.getActivateAutoLoadConfig('310e1b7ca2f94feba6d8732b38c8374d'),
				logisticDispatchingPlantLocationReceivingDataService.configureFilterSettings('310e1b7ca2f94feba6d8732b38c8374d'),
				logisticDispatchingPlantLocationReceivingDataService.getStartLoadConfig()
			]
		});

		logisticDispatchingPlantLocationReceivingDataService.loadFilterSettings('310e1b7ca2f94feba6d8732b38c8374d');
	}
})(angular);