/**
 * Created by leo on 12.03.2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobPrj2MaterialPriceConditionListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic job project 2 material price condition entities.
	 **/

	angular.module(moduleName).controller('logisticJobPrj2MaterialPriceConditionListController', LogisticJobPrj2MaterialPriceConditionListController);

	LogisticJobPrj2MaterialPriceConditionListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobPrj2MaterialPriceConditionListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '89bf60f70caf4d6db646a941b632e40b');
	}
})(angular);