/**
 * Created by sandu on 28.06.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'usermanagement.user';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name usermanagementUserLogController
	 * @function
	 *
	 * @description
	 * Controller for the  log list view
	 **/
	angModule.controller('usermanagementUserLogController', usermanagementUserLogController);

	usermanagementUserLogController.$inject = ['$scope', 'usermanagementUserLogService', 'usermanagementUserLogUIService', 'usermanagementUserLogValidationService', 'platformGridControllerService'];

	function usermanagementUserLogController($scope, usermanagementUserLogService, usermanagementUserLogUIService, usermanagementGroupLogValidationService, platformGridControllerService) {

		var myGridConfig = {initCalled: false, columns: []};
		var toolbarItems = [
			{
				id: 't1',
				caption: 'usermanagement.user.logContainer.refresh',
				type: 'item',
				cssClass: 'tlb-icons ico-refresh',
				fn: function () {
					usermanagementUserLogService.load();
				}
			}];

		platformGridControllerService.initListController($scope, usermanagementUserLogUIService, usermanagementUserLogService,
			usermanagementGroupLogValidationService, myGridConfig);
		platformGridControllerService.addTools(toolbarItems);
	}
})(angular);
