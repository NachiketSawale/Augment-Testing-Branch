/**
 * Created by leo on 08.03.2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobPrj2MaterialListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic job  entities.
	 **/

	angular.module(moduleName).controller('logisticJobPrj2MaterialListController', LogisticJobPrj2MaterialListController);

	LogisticJobPrj2MaterialListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobPrj2MaterialListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '36d8fdec018141e6b4b3a450425849b0');
	}
})(angular);