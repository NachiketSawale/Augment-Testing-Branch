/**
 * Created by nitsche on 30.04.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticPlantLocationPerformingListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic plant  entities.
	 **/

	angular.module(moduleName).controller('logisticPlantLocationPerformingListController', LogisticPlantLocationPerformingListController);

	LogisticPlantLocationPerformingListController.$inject = ['$scope', 'logisticJobPlantLocationListControllerBase','logisticDispatchingPlantLocationPerformingDataService'];

	function LogisticPlantLocationPerformingListController($scope, logisticJobPlantLocationListControllerBase,logisticDispatchingPlantLocationPerformingDataService) {
		logisticJobPlantLocationListControllerBase.initController($scope, moduleName, '38a19e0b6649476a8484c35bee2b0803', undefined, logisticDispatchingPlantLocationPerformingDataService);
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				logisticDispatchingPlantLocationPerformingDataService.getDeadlineButtonConfig(),
				logisticDispatchingPlantLocationPerformingDataService.getDetailsButtonConfig(),
				logisticDispatchingPlantLocationPerformingDataService.getActivateAutoLoadConfig('38a19e0b6649476a8484c35bee2b0803'),
				logisticDispatchingPlantLocationPerformingDataService.configureFilterSettings('38a19e0b6649476a8484c35bee2b0803'),
				logisticDispatchingPlantLocationPerformingDataService.getStartLoadConfig()
			]
		});

		logisticDispatchingPlantLocationPerformingDataService.loadFilterSettings('38a19e0b6649476a8484c35bee2b0803');
	}
})(angular);