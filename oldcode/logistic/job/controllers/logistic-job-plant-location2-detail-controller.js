/**
 * Created by nitsche on 30.04.2020
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobPlantLocation2DetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic job  entities.
	 **/
	angular.module(moduleName).controller('logisticJobPlantLocation2DetailController', LogisticJobPlantLocation2DetailController);

	LogisticJobPlantLocation2DetailController.$inject = ['$scope', 'platformContainerControllerService', 'logisticJobLocation2DataService'];

	function LogisticJobPlantLocation2DetailController($scope, platformContainerControllerService, logisticJobLocation2DataService) {
		platformContainerControllerService.initController($scope, moduleName, '98adf5d9ac8748caa69d1c1f95462402');
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				logisticJobLocation2DataService.getDeadlineButtonConfig()
			]
		});
	}

})(angular);