/**
 * Created by nitsche on 30.04.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobPlantLocation2ListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic job  entities.
	 **/

	angular.module(moduleName).controller('logisticJobPlantLocation2ListController', LogisticJobPlantLocation2ListController);

	LogisticJobPlantLocation2ListController.$inject = ['$scope', 'logisticJobPlantLocationListControllerBase', 'logisticJobLocation2DataService'];

	function LogisticJobPlantLocation2ListController($scope, logisticJobPlantLocationListControllerBase, logisticJobLocation2DataService) {
		logisticJobPlantLocationListControllerBase.initController($scope, moduleName, '283d7092e9fb431ca2b9610466d1de91', undefined, logisticJobLocation2DataService);
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				logisticJobLocation2DataService.getDeadlineButtonConfig(),
				logisticJobLocation2DataService.configureFilterSettings('283d7092e9fb431ca2b9610466d1de91'),
				logisticJobLocation2DataService.getDetailsButtonConfig()
			]
		});

		logisticJobLocation2DataService.loadFilterSettings('283d7092e9fb431ca2b9610466d1de91');
	}
})(angular);