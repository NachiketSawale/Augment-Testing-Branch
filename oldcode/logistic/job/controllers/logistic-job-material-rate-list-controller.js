/**
 * Created by baf on 08.02.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobMaterialRateListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic job material rate entities.
	 **/

	angular.module(moduleName).controller('logisticJobMaterialRateListController', LogisticJobMaterialRateListController);

	LogisticJobMaterialRateListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobMaterialRateListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '19ee8d84d00c4b9d936713e302ae49f0');
	}
})(angular);