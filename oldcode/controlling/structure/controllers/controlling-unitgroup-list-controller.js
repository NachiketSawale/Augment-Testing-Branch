/**
 * Created by janas on 12.11.2014.
 */


(function () {

	'use strict';
	var moduleName = 'controlling.structure';

	/**
	 * @ngdoc controller
	 * @name controllingStructureUnitgroupListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of entity entities.
	 **/
	angular.module(moduleName).controller('controllingStructureUnitgroupListController',
		['$scope', 'platformContainerControllerService', function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '9E5B5809635C45DE90E27A567FF6B0E9');
		}]);
})();
