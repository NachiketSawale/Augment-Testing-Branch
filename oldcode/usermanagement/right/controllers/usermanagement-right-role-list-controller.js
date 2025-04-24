/**
 * Created by sandu on 14.09.2015.
 */
(function(angular){

	'use strict';

	var moduleName = 'usermanagement.right';
	var angModule = angular.module(moduleName);

	/**
     * @ngdoc controller
     * @name usermanagementRoleListController
     * @function
     *
     * @description
     * Controller for the  role list view
     **/
	angModule.controller('usermanagementRoleListController', usermanagementRoleListController);

	usermanagementRoleListController.$inject = ['$scope', 'usermanagementRightMainService', 'usermanagementRoleUIService', 'usermanagementRoleValidationService','platformGridControllerService','platformModuleNavigationService','platformDeleteSelectionDialogService', 'usermanagementRightService'];

	function usermanagementRoleListController($scope, usermanagementRightMainService, usermanagementRoleUIService, usermanagementRoleValidationService,platformGridControllerService, platformModuleNavigationService, platformDeleteSelectionDialogService, usermanagementRightService){

		var myGridConfig = {initCalled: false, columns: []};

		var toolbarItems = [

			{
				caption: 'usermanagement.user.goto',
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-goto',
				list: {
					showImages: true,
					cssClass: 'dropdown-menu-right',
					items: [{
						id: 'users',
						type: 'item',
						disabled: false,
						caption: 'usermanagement.right.users',
						iconClass: 'app-small-icons ico-users',
						fn: function () {
							platformModuleNavigationService.navigate({
								moduleName: 'usermanagement.user'
							});
						}
					}, {
						id: 'groups',
						type: 'item',
						disabled: false,
						iconClass: 'app-small-icons ico-groups',
						caption: 'usermanagement.right.groups',
						fn: function () {
							platformModuleNavigationService.navigate({
								moduleName: 'usermanagement.group'
							});
						}
					}, {
						id: 'clerk',
						type: 'item',
						disabled: false,
						iconClass: 'app-small-icons ico-clerk',
						caption: 'usermanagement.right.clerk',
						fn: function () {
							platformModuleNavigationService.navigate({
								moduleName: 'basics.clerk'
							});
						}
					}, {
						id: 'company',
						type: 'item',
						disabled: false,
						iconClass: 'app-small-icons ico-company-structure',
						caption: 'usermanagement.right.company',
						fn: function () {
							platformModuleNavigationService.navigate({
								moduleName: 'basics.company'
							});
						}
					}, {
						id: 'customizing',
						type: 'item',
						disabled: false,
						iconClass: 'app-small-icons ico-settings',
						caption: 'usermanagement.right.customizing',
						fn: function () {
							platformModuleNavigationService.navigate({
								moduleName: 'basics.customize'
							});
						}
					}]
				}
			}
		];

		platformGridControllerService.initListController($scope, usermanagementRoleUIService, usermanagementRightMainService,
			usermanagementRoleValidationService, myGridConfig);

		var containerScope;

		containerScope = $scope.$parent;
		while (containerScope && !containerScope.hasOwnProperty('getContainerUUID')) {
			containerScope = containerScope.$parent;
		}

		containerScope.tools.items[3].fn = function () {
			platformDeleteSelectionDialogService.showDialog().then(result => {
				if(result.delete){
					usermanagementRightMainService.deleteRole();
				}
			});
		};

		platformGridControllerService.addTools(toolbarItems);

		let selectionChanged = function (){
			if(usermanagementRightMainService.getSelectedEntities().length !== 1){
				usermanagementRightService.disableContainer();
			}else{
				usermanagementRightService.enableContainer();
			}
		};

		usermanagementRightMainService.registerSelectedEntitiesChanged(selectionChanged);

		$scope.$on('$destroy', function () {
			usermanagementRightMainService.unregisterSelectedEntitiesChanged(selectionChanged);
		});

	}
})(angular);