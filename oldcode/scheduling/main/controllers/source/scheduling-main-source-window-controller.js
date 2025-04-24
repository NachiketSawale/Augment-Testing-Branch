/**
 * Created by leo on 16.01.2017.
 */
(function () {

	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainSourceWindowController
	 * @function
	 *
	 * @description
	 **/
	angular.module(moduleName).controller('schedulingMainSourceWindowController',
		['$scope', 'schedulingMainSourceWindowControllerService',
			function ($scope, schedulingMainSourceWindowControllerService) {

				var uuid = $scope.getContainerUUID();
				schedulingMainSourceWindowControllerService.initSourceFilterController($scope, uuid);
			}
		]);
})();
