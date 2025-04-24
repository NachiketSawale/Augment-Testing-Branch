/**
 * Created by zwz on 6/30/2020.
 */
(function () {
	'use strict';
	

	/**
	 * @ngdoc controller
	 * @name ppsCommonLogListController
	 * @requires $scope, platformSourceWindowControllerService
	 * @description
	 * #
	 * Controller for general log list controller
	 */
	var moduleName = 'productionplanning.common';
	angular.module(moduleName).controller('ppsCommonLogSourceWindowController', ctrl);
	ctrl.$inject = ['$scope', 'platformSourceWindowControllerService'];
	function ctrl($scope, platformSourceWindowControllerService) {
		var uuid = $scope.getContainerUUID();

		platformSourceWindowControllerService.initSourceFilterController($scope,uuid,'ppsCommonContainerInformationService','ppsCommonLogSourceFilterService');
	}
})();