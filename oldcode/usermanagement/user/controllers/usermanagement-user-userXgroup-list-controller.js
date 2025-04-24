/**
 * Created by sandu on 26.08.2015.
 */
(function (angular) {

	'use strict';

	var moduleName = 'usermanagement.user';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name usermanagementUserXGroupListController
	 * @function
	 *
	 * @description
	 * Controller for the  userXgroup list view
	 **/
	angModule.controller('usermanagementUserXGroupListController', usermanagementUserXGroupListController);

	usermanagementUserXGroupListController.$inject = ['$scope', 'usermanagementUserXGroupService', 'usermanagementUserXGroupUIService', 'usermanagementUserXGroupValidationService', 'platformGridControllerService'];

	function usermanagementUserXGroupListController($scope, usermanagementUserXGroupService, usermanagementUserXGroupUIService, usermanagementUserXGroupValidationService, platformGridControllerService) {

		var myGridConfig = {initCalled: false, columns: []};

		platformGridControllerService.initListController($scope, usermanagementUserXGroupUIService, usermanagementUserXGroupService,
			usermanagementUserXGroupValidationService, myGridConfig);
	}
})(angular);
