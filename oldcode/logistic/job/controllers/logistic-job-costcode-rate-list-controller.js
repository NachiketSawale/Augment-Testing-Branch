/**
 * Created by leo on 12.03.2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobCostCodeRateListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic job  costcode rate entities.
	 **/

	angular.module(moduleName).controller('logisticJobCostCodeRateListController', LogisticJobCostCodeRateListController);

	LogisticJobCostCodeRateListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobCostCodeRateListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'd106505776d14f8c9f4737b18370b2cb');
	}
})(angular);