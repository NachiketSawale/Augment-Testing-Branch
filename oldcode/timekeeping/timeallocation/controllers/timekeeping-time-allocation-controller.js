/**
 * Created by sprotte on 15/09/21
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'timekeeping.timeallocation';

	/**
	 * @ngdoc controller
	 * @name timekeepingTimeallocationController
	 * @function
	 *
	 * @description
	 * Main controller of timekeeping timeallocation module.
	 **/

	angular.module(moduleName).controller('timekeepingTimeallocationController', timekeepingTimeallocationController);

	timekeepingTimeallocationController.$inject = ['_', '$injector', '$scope', 'platformMainControllerService', 'platformNavBarService', 'timekeepingTimeallocationHeaderDataService', 'timekeepingTimeallocationTranslationService', 'basicsWorkflowSidebarRegisterService', 'timekeepingTimeallocationItemDataService'];

	function timekeepingTimeallocationController(_, $injector, $scope, platformMainControllerService, platformNavBarService, timekeepingTimeallocationHeaderDataService, timekeepingTimeallocationTranslationService, basicsWorkflowSidebarRegisterService, timekeepingTimeallocationItemDataService) {
		$scope.path = globals.appBaseUrl;

		var options = { search: true, reports: true };
		var configObject = {};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, timekeepingTimeallocationHeaderDataService, configObject, timekeepingTimeallocationTranslationService, 'timekeeping.timeallocation', options);

		// loads or updates translated strings
		function loadTranslations() {
			$scope.translate = timekeepingTimeallocationTranslationService.getTranslate();
		}

		// Registering entities for time allocation module
		basicsWorkflowSidebarRegisterService.registerEntityForModule('2EA863275F8349ECA61B1796E0AE1C15', moduleName, false,
			function getSelectedID() {
				let timeAllocationHeaderDataService = $injector.get('timekeepingTimeallocationHeaderDataService');
				let selModel = timeAllocationHeaderDataService.getSelected();
				if (selModel) {
					return selModel.Id;
				}
				return undefined;
			}, function getModelIdList() {
				let timeAllocationHeaderDataService = $injector.get('timekeepingTimeallocationHeaderDataService');
				let items = timeAllocationHeaderDataService.getList();
				return _.map(_.isArray(items) ? items : [], function (modelEntity) {
					return modelEntity.Id;
				});
			}, angular.noop, angular.noop, angular.noop, true);


		basicsWorkflowSidebarRegisterService.registerEntityForModule('698C0B854EF2434BBB4A6DD4F2DEA43D', moduleName, false,
			function getSelectedID() {
				let timeAllocationDataService = $injector.get('timekeepingTimeallocationItemDataService');
				let selModel = timeAllocationDataService.getSelected();
				if (selModel) {
					return selModel.Id;
				}
				return undefined;
			}, function getModelIdList() {
				let timeAllocationDataService = $injector.get('timekeepingTimeallocationItemDataService');
				let items = timeAllocationDataService.getList();
				return _.map(_.isArray(items) ? items : [], function (modelEntity) {
					return modelEntity.Id;
				});
			}, angular.noop, angular.noop, angular.noop, true);

		// register translation changed event
		timekeepingTimeallocationTranslationService.registerUpdates(loadTranslations);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			timekeepingTimeallocationTranslationService.unregisterUpdates();
			platformNavBarService.clearActions();
			timekeepingTimeallocationItemDataService.setSelected(null);
			platformMainControllerService.unregisterCompletely(timekeepingTimeallocationHeaderDataService, sidebarReports, timekeepingTimeallocationTranslationService, options);
		});
	}

})(angular);