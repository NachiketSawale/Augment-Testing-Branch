/**
 * Created by leo on 16.01.2017.
 */
(function () {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainSourceWindowController
	 * @function
	 *
	 * @description
	 **/
	angular.module(moduleName).controller('projectMainSourceWindowController',
		['$scope', 'projectMainSourceWindowControllerService',
			function ($scope, projectMainSourceWindowControllerService) {

				var uuid = $scope.getContainerUUID();
				projectMainSourceWindowControllerService.initSourceFilterController($scope, uuid);
			}
		]);
})();