/**
 * Created by sandu on 07.09.2015.
 */
(function (angular) {

	'use strict';

	var moduleName = 'usermanagement.group';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name usermanagementUserXGroupListController
	 * @function
	 *
	 * @description
	 * Controller for the  userXgroup list view
	 **/
	angModule.controller('usermanagementGroupUserXGroupListController', usermanagementGroupUserXGroupListController);

	usermanagementGroupUserXGroupListController.$inject = ['$scope', 'usermanagementGroupUserXGroupService', 'usermanagementGroupUserXGroupDetailLayout', 'usermanagementGroupUserXGroupValidationService', 'platformGridControllerService', 'platformGridAPI', 'usermanagementGroupMainService'];

	function usermanagementGroupUserXGroupListController($scope, usermanagementGroupUserXGroupService, usermanagementGroupUserXGroupUIService, usermanagementGroupUserXGroupValidationService, platformGridControllerService, platformGridAPI, usermanagementGroupMainService) {

		var myGridConfig = {initCalled: false, columns: []};

		function updateButtons(a, group) {
			angular.forEach($scope.tools.items, function (item) {
				if (group && group.DomainSID) {
					if (item.id === 'create' || item.id === 'delete') {
						item.hideItem = true;
					}
				}else{
					item.hideItem = false;
				}
			});
			$scope.tools.update();
		}

		usermanagementGroupMainService.registerSelectionChanged(updateButtons);

		platformGridControllerService.initListController($scope, usermanagementGroupUserXGroupUIService, usermanagementGroupUserXGroupService,
			usermanagementGroupUserXGroupValidationService, myGridConfig);

		$scope.$on('$destroy', function () {
			usermanagementGroupMainService.unregisterSelectionChanged(updateButtons);
		});

	}
})(angular);