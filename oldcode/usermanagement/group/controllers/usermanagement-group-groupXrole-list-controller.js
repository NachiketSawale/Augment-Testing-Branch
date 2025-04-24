/**
 * Created by sandu on 07.09.2015.
 */
(function(angular){

	'use strict';

	var moduleName = 'usermanagement.group';
	var angModule = angular.module(moduleName);

	/**
     * @ngdoc controller
     * @name usermanagementGroupXRoleListController
     * @function
     *
     * @description
     * Controller for the  groupXrole list view
     **/
	angModule.controller('usermanagementGroupXRoleListController', usermanagementGroupXRoleListController);

	usermanagementGroupXRoleListController.$inject = ['$scope', 'usermanagementGroupXRoleService', 'usermanagementGroupXRoleDetailLayout', 'usermanagementGroupXRoleValidationService','platformGridControllerService' ];

	function usermanagementGroupXRoleListController($scope, usermanagementGroupXRoleService, usermanagementGroupXRoleUIService, usermanagementGroupXRoleValidationService,platformGridControllerService){

		var myGridConfig = {initCalled: false, columns: []};

		platformGridControllerService.initListController($scope, usermanagementGroupXRoleUIService, usermanagementGroupXRoleService,
			usermanagementGroupXRoleValidationService, myGridConfig);


	}
})(angular);