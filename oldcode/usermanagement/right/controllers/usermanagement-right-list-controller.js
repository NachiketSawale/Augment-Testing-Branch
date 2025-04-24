/**
 * Created by sandu on 16.09.2015.
 */
(function (angular) {

	'use strict';

	var moduleName = 'usermanagement.right';
	var angModule = angular.module(moduleName);

	/**
     * @ngdoc controller
     * @name usermanagementRightListController
     * @function
     *
     * @description
     * Controller for the  right list view
     **/
	angModule.controller('usermanagementRightListController', usermanagementRightListController);

	usermanagementRightListController.$inject = ['$scope', 'usermanagementRightService', 'usermanagementRightDescriptorStructureUIService', 'usermanagementRightValidationService', 'platformGridControllerService', 'usermanagementRightDescriptorStructureSelectionDialog'];

	function usermanagementRightListController($scope, usermanagementRightService, usermanagementRightDescriptorStructureUIService, usermanagementRightValidationService, platformGridControllerService, usermanagementRightDescriptorStructureSelectionDialog) {

		var myGridConfig = {initCalled: false, columns: [], parentProp: 'ParentGuid', childProp: 'Nodes'};

		platformGridControllerService.initListController($scope, usermanagementRightDescriptorStructureUIService, usermanagementRightService,
			usermanagementRightValidationService, myGridConfig);

		$scope.removeToolByClass($scope.tools.items[3]);

		var containerScope;

		containerScope = $scope.$parent;
		while (containerScope && !containerScope.hasOwnProperty('getContainerUUID')) {
			containerScope = containerScope.$parent;
		}

		containerScope.tools.items[1].fn = function () {
			usermanagementRightDescriptorStructureSelectionDialog.showDialog();
		};
	}
})(angular);