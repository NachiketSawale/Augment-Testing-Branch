/**
 * Created by baf on 14.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobPlantLocationListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic job plantLocation entities.
	 **/

	angular.module(moduleName).controller('logisticJobPlantLocationListController', LogisticJobPlantLocationListController);

	LogisticJobPlantLocationListController.$inject = ['$scope', 'platformContainerControllerService',
		'resourceCommonPlantJobLocationToolService', 'logisticJobPlantLocationDataService'];

	function LogisticJobPlantLocationListController($scope, platformContainerControllerService,
	  resourceCommonPlantJobLocationToolService,logisticJobPlantLocationDataService) {

		var filterConfig = logisticJobPlantLocationDataService.getConfiguration();

		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				resourceCommonPlantJobLocationToolService.getFilterConfig(filterConfig)
			]
		});

		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				resourceCommonPlantJobLocationToolService.getFilterConfig(filterConfig)
			]
		});

		platformContainerControllerService.initController($scope, moduleName, '036e468f170041568771dcef1a4708e0');

	}
})(angular);