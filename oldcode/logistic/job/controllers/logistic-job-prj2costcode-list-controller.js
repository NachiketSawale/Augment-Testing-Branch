/**
 * Created by leo on 08.03.2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobPrj2CostCodeListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic job  entities.
	 **/

	angular.module(moduleName).controller('logisticJobPrj2CostCodeListController', LogisticJobPrj2CostCodeListController);

	LogisticJobPrj2CostCodeListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobPrj2CostCodeListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b40fb36b82954bfaa734500d03c6bde4');
	}
})(angular);