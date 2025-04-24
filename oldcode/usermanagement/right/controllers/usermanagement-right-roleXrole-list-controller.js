/**
 * Created by sandu on 16.09.2015.
 */
(function(angular){

	'use strict';

	var moduleName = 'usermanagement.right';
	var angModule = angular.module(moduleName);

	/**
     * @ngdoc controller
     * @name usermanagementRoleXRoleListController
     * @function
     *
     * @description
     * Controller for the  roleXrole list view
     **/
	angModule.controller('usermanagementRoleXRoleListController', usermanagementRoleXRoleListController);

	usermanagementRoleXRoleListController.$inject = ['$scope', 'usermanagementRoleXRoleService', 'usermanagementRoleXRoleUIService', 'usermanagementRoleXRoleValidationService','platformGridControllerService' ];

	function usermanagementRoleXRoleListController($scope, usermanagementRoleXRoleService, usermanagementRoleXRoleUIService, usermanagementRoleXRoleValidationService,platformGridControllerService){

		var myGridConfig = {initCalled: false, columns: []};

		platformGridControllerService.initListController($scope, usermanagementRoleXRoleUIService, usermanagementRoleXRoleService,
			usermanagementRoleXRoleValidationService, myGridConfig);


	}
})(angular);