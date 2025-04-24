/**
 * Created by sprotte on 15/09/21
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.timeallocation';
	
	/**
	 * @ngdoc controller
	 * @name timekeepingTimeallocationItemDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping timeallocation timeallocationheader entities.
	 **/
	angular.module(moduleName).controller('timekeepingTimeallocationItemDetailController', TimekeepingTimeallocationItemDetailController);

	TimekeepingTimeallocationItemDetailController.$inject = ['$scope', 'platformContainerControllerService', '_', 'timekeepingTimeallocationActionColumnService', 'platformFormConfigService', '$timeout'];

	function TimekeepingTimeallocationItemDetailController($scope, platformContainerControllerService, _, timekeepingTimeallocationActionColumnService,platformFormConfigService, $timeout) {
		platformContainerControllerService.initController($scope, moduleName, 'd9ef33f2b9c04d63b5218ce7aa7236d2');

		function changeActionRows() {
			$scope.formOptions.configure = timekeepingTimeallocationActionColumnService.getStandardConfigForDetailView();
			if (_.isNil($scope.formOptions.configure.uuid)){
				$scope.formOptions.configure.uuid = 'd9ef33f2b9c04d63b5218ce7aa7236d2';
			}
			platformFormConfigService.initialize($scope.formOptions, $scope.formOptions.configure);

			$timeout(function () {
				$scope.$broadcast('form-config-updated');
			});

		}

		timekeepingTimeallocationActionColumnService.registerSetConfigLayout(changeActionRows);
	}

})(angular);