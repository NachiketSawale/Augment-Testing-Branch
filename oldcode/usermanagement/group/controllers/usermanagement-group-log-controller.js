/**
 * Created by sandu on 27.06.2016.
 */
(function(angular){

	'use strict';

	var moduleName = 'usermanagement.group';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name usermanagementGroupLogController
	 * @function
	 *
	 * @description
	 * Controller for the  log list view
	 **/
	angModule.controller('usermanagementGroupLogController', usermanagementGroupLogController);

	usermanagementGroupLogController.$inject = ['$scope', 'usermanagementGroupLogService', 'usermanagementGroupLogDetailLayout', 'usermanagementGroupLogValidationService','platformGridControllerService' ];

	function usermanagementGroupLogController($scope, usermanagementGroupLogService, usermanagementGroupLogDetailLayout, usermanagementGroupLogValidationService,platformGridControllerService){

		var myGridConfig = {initCalled: false, columns: []};

		var toolbarItems = [
			{
				id: 't1',
				caption: 'usermanagement.group.logContainer.refresh',
				type: 'item',
				cssClass: 'tlb-icons ico-refresh',
				fn:  function(){
					usermanagementGroupLogService.load();
				}
			}];

		platformGridControllerService.initListController($scope, usermanagementGroupLogDetailLayout, usermanagementGroupLogService,
			usermanagementGroupLogValidationService, myGridConfig);
		platformGridControllerService.addTools(toolbarItems);
	}
})(angular);