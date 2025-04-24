/**
 * Created by sandu on 26.08.2015.
 */
(function (angular) {

	'use strict';

	var moduleName = 'usermanagement.user';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name usermanagementUserListController
	 * @function
	 *
	 * @description
	 * Controller for the  user list view
	 **/
	angModule.controller('usermanagementUserListController', usermanagementUserListController);

	usermanagementUserListController.$inject = ['$scope', 'usermanagementUserMainService', 'usermanagementUserUIService', 'usermanagementUserValidationService', 'platformGridControllerService', 'usermanagementUserImportService', 'usermanagementUserSyncService', 'usermanagementMainAdsConfigService', '$timeout', 'platformGridAPI', 'platformModuleNavigationService'];

	function usermanagementUserListController($scope, usermanagementUserMainService, usermanagementUserUIService, usermanagementUserValidationService, platformGridControllerService, usermanagementUserImportService, usermanagementUserSyncService, usermanagementMainAdsConfigService, $timeout, platformGridAPI, platformModuleNavigationService) {

		var myGridConfig = {initCalled: false, columns: []};

		var toolbarItems = [
			{
				id: 't1',
				caption: 'usermanagement.user.adButtons.adConfig',
				type: 'item',
				cssClass: 'tlb-icons ico-active-directory-config',
				fn: function () {
					usermanagementMainAdsConfigService.showConfig();
				}
			},
			{
				id: 't2',
				caption: 'usermanagement.user.adButtons.groupImport',
				type: 'item',
				cssClass: 'tlb-icons ico-active-directory-import',
				fn: function () {
					usermanagementUserImportService.showUserImport();
				}
			},
			{
				id: 't3',
				caption: 'usermanagement.user.adButtons.adDisco',
				type: 'item',
				cssClass: 'tlb-icons ico-active-directory-disconnect',
				fn: function () {
					usermanagementUserMainService.adDisconnect();
					$scope.tools.update();
				},
				disabled: function () {
					return !usermanagementUserMainService.hasSelection() || usermanagementUserMainService.getSelected().DomainSID === null;
				}
			},
			{
				id: 't4',
				caption: 'usermanagement.user.adButtons.groupSync',
				type: 'item',
				cssClass: 'tlb-icons ico-active-directory-sync',
				fn: function () {
					usermanagementMainAdsConfigService.getLdapParameters().then(function (response) {
						var preValidation = response.showPreValidation === 'true';
						if (preValidation) {
							usermanagementUserSyncService.syncUsersNoPreValidation();
						} else {
							usermanagementUserSyncService.showUserSync();
						}
					});
				}
			},
			{
				caption: 'usermanagement.user.goto',
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-goto',
				list: {
					showImages: true,
					cssClass: 'dropdown-menu-right',
					items: [{
						id: 'groups',
						type: 'item',
						disabled: false,
						caption: 'usermanagement.user.groups',
						iconClass: 'app-small-icons ico-groups',
						fn: function () {
							platformModuleNavigationService.navigate({
								moduleName: 'usermanagement.group'
							});
						}
					}, {
						id: 'roles',
						type: 'item',
						disabled: false,
						iconClass: 'app-small-icons ico-users',
						caption: 'usermanagement.user.roles',
						fn: function () {
							platformModuleNavigationService.navigate({
								moduleName: 'usermanagement.right'
							});
						}
					}, {
						id: 'clerk',
						type: 'item',
						disabled: false,
						iconClass: 'app-small-icons ico-clerk',
						caption: 'usermanagement.user.clerk',
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
						caption: 'usermanagement.user.company',
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
						caption: 'usermanagement.user.customizing',
						fn: function () {
							platformModuleNavigationService.navigate({
								moduleName: 'basics.customize'
							});
						}
					}]
				}
			}
		];

		var isProtected = function (item) {
			return item.IsProtected;
		};

		var deleteBtnDisabledUpdated = false;

		platformGridControllerService.initListController($scope, usermanagementUserUIService, usermanagementUserMainService,
			usermanagementUserValidationService, myGridConfig);

		platformGridControllerService.addTools(toolbarItems);

		var updateTools = function () {
			if (!deleteBtnDisabledUpdated) {
				var deleteBtn = _.find($scope.tools.items, {id: 'delete'});
				if (!_.isUndefined(deleteBtn)) {
					deleteBtn.disabled = function () {
						var selectedItem = $scope.getSelectedItem();
						if (!selectedItem) return true;
						return selectedItem.IsProtected; // fixed null issue
					};
					deleteBtnDisabledUpdated = true;
				}
			}
			$timeout($scope.tools.update, 0, true);
		};

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', updateTools);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', updateTools);
		});
	}
})(angular);
